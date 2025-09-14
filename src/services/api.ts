import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_TICKET_APPSYNC_API_URL,
})

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            'x-api-key': process.env.NEXT_PUBLIC_TICKET_APPSYNC_API_KEY || '',
            'Content-Type': 'application/json',
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
        },
        query: {
            errorPolicy: 'all',
        },
    }
})

// Enhanced security validation with detailed checks
export const validateTicketWithSecurityChecks = async (
    scanningEventId: string,
    ticketId: string,
    qrCodeEventId?: string
) => {
    const VALIDATE_TICKET = gql`
        query ListSalesTickets($filter: TableSalesTicketsFilterInput, $nextToken: String) {
            listSalesTickets(filter: $filter, nextToken: $nextToken) {
                items {
                    TicketID
                    GSI1PK
                    CustomerEmail
                    Status
                    ScanCount
                    MaxScans
                    IsValid
                    LastScannedAt
                    AccessLevel
                    CustomerName
                    EventID
                    EventName
                    EventThumbnail
                }
                nextToken
            }
        }
    `

    // Security Check 1: If QR code contains eventId, verify it matches the scanning event
    if (qrCodeEventId && qrCodeEventId !== scanningEventId) {
        return {
            valid: false,
            error: `Security Check Failed: This ticket is for event "${qrCodeEventId}" but you are scanning for event "${scanningEventId}"`,
            securityViolation: true,
            violationType: 'EVENT_ID_MISMATCH'
        }
    }

    try {
        let nextToken = null
        let currentPage = 1
        let totalItemsChecked = 0

        do {
            const variables = {
                filter: {
                    TicketID: {
                        eq: ticketId
                    }
                },
                nextToken
            }
            const result = await client.query({
                query: VALIDATE_TICKET,
                variables,
                fetchPolicy: 'network-only'
            })

            const { data } = result

            if (result.errors && result.errors.length > 0) {
                console.error('❌ Validation GraphQL Error:', result.errors)
                return {
                    valid: false,
                    error: 'Ticket validation failed due to API error',
                    securityViolation: true,
                    violationType: 'API_ERROR'
                }
            }

            if (!data) {
                console.error('❌ Validation Data is null')
                return {
                    valid: false,
                    error: 'Ticket validation failed - no data returned',
                    securityViolation: true,
                    violationType: 'NO_DATA'
                }
            }

            const items = data.listSalesTickets?.items || []
            totalItemsChecked += items.length


            // Security Check 2: Find ticket that matches both ticket ID and event ID
            console.log('🔍 Validation Debug:', {
                ticketId,
                scanningEventId,
                qrCodeEventId,
                ticketsFound: items.length,
                ticketSample: items[0] ? {
                    TicketID: items[0].TicketID,
                    GSI1PK: items[0].GSI1PK,
                    CustomerEmail: items[0].CustomerEmail
                } : 'No tickets found'
            })
            
            const validTicket = items.find(ticket =>
                ticket.TicketID === ticketId && ticket.GSI1PK === scanningEventId
            )

            if (validTicket) {
                // Additional validation checks for real ticket data
                
                // Check if ticket is active
                if (validTicket.Status === 'inactive') {
                    return {
                        valid: false,
                        error: 'This ticket has been deactivated',
                        securityViolation: true,
                        violationType: 'TICKET_INACTIVE',
                        ticket: validTicket
                    }
                }
                
                // Check if ticket has been scanned too many times
                const scanCount = parseInt(validTicket.ScanCount || '0')
                const maxScans = parseInt(validTicket.MaxScans || '1')
                
                console.log('🔍 Ticket Status Check:', {
                    status: validTicket.Status,
                    scanCount,
                    maxScans,
                    isValid: validTicket.IsValid,
                    lastScannedAt: validTicket.LastScannedAt
                })
                
                if (scanCount >= maxScans) {
                    return {
                        valid: false,
                        error: `This ticket has already been used (${scanCount}/${maxScans} scans)`,
                        securityViolation: true,
                        violationType: 'TICKET_ALREADY_USED',
                        ticket: validTicket
                    }
                }
                
                // Check if ticket is valid
                if (validTicket.IsValid === false || validTicket.IsValid === 'false') {
                    return {
                        valid: false,
                        error: 'This ticket has been marked as invalid',
                        securityViolation: true,
                        violationType: 'TICKET_MARKED_INVALID',
                        ticket: validTicket
                    }
                }

                return {
                    valid: true,
                    ticket: validTicket,
                    securityChecks: {
                        ticketExists: true,
                        eventIdMatch: true,
                        qrCodeEventMatch: qrCodeEventId ? qrCodeEventId === scanningEventId : true,
                        statusActive: validTicket.Status !== 'inactive',
                        scansRemaining: maxScans - scanCount,
                        isValidTicket: validTicket.IsValid !== false
                    }
                }
            }

            // Security Check 3: Check if ticket exists but for different event
            const ticketInDifferentEvent = items.find(ticket => ticket.TicketID === ticketId)

            if (ticketInDifferentEvent) {
                return {
                    valid: false,
                    error: `Security Check Failed: This ticket belongs to event "${ticketInDifferentEvent.GSI1PK}" but you are scanning for event "${scanningEventId}"`,
                    securityViolation: true,
                    violationType: 'WRONG_EVENT',
                    ticket: ticketInDifferentEvent
                }
            }

            nextToken = data.listSalesTickets?.nextToken
            currentPage++

            if (currentPage > 50) {
                break
            }

        } while (nextToken)
        return {
            valid: false,
            error: 'Security Check Failed: This ticket does not exist in our database',
            securityViolation: true,
            violationType: 'TICKET_NOT_FOUND'
        }

    } catch (error) {
        console.error('❌ Security validation error:', error)
        return {
            valid: false,
            error: 'Security validation failed due to system error',
            securityViolation: true,
            violationType: 'SYSTEM_ERROR'
        }
    }
}

// Helper function to parse QR code data
export const parseQRCode = (qrData: string) => {
    try {
        console.log('🔍 QR Code Debug - Raw data:', qrData)

        // Try to parse as JSON first
        if (qrData.startsWith('{')) {
            const parsed = JSON.parse(qrData)
            const result = {
                customerEmail: parsed.customerEmail || parsed.CustomerEmail,
                eventId: parsed.eventId || parsed.EventID || parsed.GSI1PK,
                ticketId: parsed.ticketId || parsed.TicketID,
                format: 'JSON'
            }
            console.log('🔍 QR Code Debug - Parsed JSON:', result)
            return result
        }

        // Try to parse as comma-separated values (customerEmail,eventId,ticketId)
        const parts = qrData.split(',')
        if (parts.length >= 3) {
            return {
                customerEmail: parts[0].trim(),
                eventId: parts[1].trim(),
                ticketId: parts[2].trim(),
                format: 'CSV'
            }
        }

        // Try to parse as pipe-separated values (customerEmail|eventId|ticketId)
        const pipeParts = qrData.split('|')
        if (pipeParts.length >= 3) {
            return {
                customerEmail: pipeParts[0].trim(),
                eventId: pipeParts[1].trim(),
                ticketId: pipeParts[2].trim(),
                format: 'PIPE'
            }
        }
        return {
            ticketId: qrData.trim(),
            format: 'TICKET_ID_ONLY'
        }

    } catch (error) {
        console.error('❌ QR Code parsing error:', error)
        // Fallback to treating as ticket ID
        return {
            ticketId: qrData.trim(),
            format: 'FALLBACK'
        }
    }
}

export const validateTicket = async (eventId: string, ticketId: string) => {
    return await validateTicketWithSecurityChecks(eventId, ticketId)
}

// Function to mark a ticket as scanned/admitted
export const admitTicket = async (ticketId: string, customerEmail: string) => {
    const ADMIT_TICKET = gql`
        mutation UpdateSalesTickets($input: UpdateSalesTicketsInput!) {
            updateSalesTickets(input: $input) {
                TicketID
                CustomerEmail
                Status
                ScanCount
                LastScannedAt
            }
        }
    `

    try {
        const currentTime = new Date().toISOString()
        
        const result = await client.mutate({
            mutation: ADMIT_TICKET,
            variables: {
                input: {
                    TicketID: ticketId,
                    CustomerEmail: customerEmail,
                    Status: "scanned",
                    ScanCount: "1",
                    LastScannedAt: currentTime
                }
            }
        })

        const { data } = result

        if (result.errors && result.errors.length > 0) {
            console.error('❌ Admission Mutation Error:', result.errors)
            return {
                success: false,
                error: 'Failed to update ticket status - API error'
            }
        }

        if (!data) {
            console.error('❌ Admission Data is null')
            return {
                success: false,
                error: 'Failed to update ticket status - no data returned'
            }
        }

        console.log('✅ Ticket successfully admitted:', data.updateSalesTickets)
        return {
            success: true,
            ticket: data.updateSalesTickets
        }

    } catch (error) {
        console.error('❌ Admission Error:', error)
        return {
            success: false,
            error: 'Failed to admit ticket - network error'
        }
    }
}

export const getEvent = async (eventId: string) => {
    const GET_EVENT = gql`
        query ListSalesTickets($filter: TableSalesTicketsFilterInput, $nextToken: String) {
            listSalesTickets(filter: $filter, nextToken: $nextToken) {
                items {
                    GSI1PK
                    EventID
                    EventName
                    EventThumbnail
                }
                nextToken
            }
        }
    `
    try {
        let nextToken = null
        let currentPage = 1
        let totalItemsChecked = 0

        do {
            const variables = {
                filter: {
                    GSI1PK: {
                        eq: eventId
                    }
                },
                nextToken
            }

            const result = await client.query({
                query: GET_EVENT,
                variables,
                fetchPolicy: 'network-only'
            })

            const { data } = result

            if (result.errors && result.errors.length > 0) {
                console.error('❌ GraphQL Query Error:', result.errors)
                return {
                    found: false,
                    error: 'Failed to fetch event data - API error'
                }
            }

            if (!data) {
                console.error('❌ GraphQL Data is null')
                return {
                    found: false,
                    error: 'Failed to fetch event data - no data returned'
                }
            }

            const items = data.listSalesTickets?.items || []
            totalItemsChecked += items.length

            const eventItem = items.find(item => item.GSI1PK === eventId)

            if (eventItem) {
                const event = {
                    EventID: eventItem.GSI1PK || eventItem.EventID,
                    EventName: eventItem.EventName || `Event ${eventId}`,
                    Venue: eventItem.VenueAddress || 'Venue not specified',
                    StartDate: eventItem.EventDate || 'Date not specified',
                    PosterURL: eventItem.EventThumbnail,
                    Description: `${eventItem.EventName || 'Event'} at ${eventItem.VenueAddress || 'venue location'}`
                }
                return {
                    found: true,
                    event
                }
            }

            nextToken = data.listSalesTickets?.nextToken
            currentPage++

            if (currentPage > 50) {
                break
            }

        } while (nextToken)
        return {
            found: false,
            error: 'Event not found'
        }

    } catch (error) {
        console.error('❌ GraphQL Error:', error)
        return {
            found: false,
            error: 'Failed to fetch event data'
        }
    }
}