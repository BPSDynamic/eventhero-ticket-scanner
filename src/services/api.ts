import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_TICKET_APPSYNC_API_URL,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'ignore',
        },
        query: {
            errorPolicy: 'ignore',
        },
    },
    headers: {
        'x-api-key': process.env.NEXT_PUBLIC_TICKET_APPSYNC_API_KEY || ''
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
            const { data } = await client.query({
                query: VALIDATE_TICKET,
                variables,
                fetchPolicy: 'network-only'
            })

            const items = data.listSalesTickets?.items || []
            totalItemsChecked += items.length


            // Security Check 2: Find ticket that matches both ticket ID and event ID
            const validTicket = items.find(ticket =>
                ticket.TicketID === ticketId && ticket.GSI1PK === scanningEventId
            )

            if (validTicket) {
                return {
                    valid: true,
                    ticket: validTicket,
                    securityChecks: {
                        ticketExists: true,
                        eventIdMatch: true,
                        qrCodeEventMatch: qrCodeEventId ? qrCodeEventId === scanningEventId : true
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

        // Try to parse as JSON first
        if (qrData.startsWith('{')) {
            const parsed = JSON.parse(qrData)
            return {
                customerEmail: parsed.customerEmail || parsed.CustomerEmail,
                eventId: parsed.eventId || parsed.EventID || parsed.GSI1PK,
                ticketId: parsed.ticketId || parsed.TicketID,
                format: 'JSON'
            }
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

export const getEvent = async (eventId: string) => {
    const GET_EVENT = gql`
        query ListSalesTickets($filter: TableSalesTicketsFilterInput, $nextToken: String) {
            listSalesTickets(filter: $filter, nextToken: $nextToken) {
                items {
                    GSI1PK
                    EventThumbnail
                    VenueAddress
                    EventDate
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

            const { data } = await client.query({
                query: GET_EVENT,
                variables,
                fetchPolicy: 'network-only'
            })


            const items = data.listSalesTickets?.items || []
            totalItemsChecked += items.length

            const eventItem = items.find(item => item.GSI1PK === eventId)

            if (eventItem) {
                const event = {
                    EventID: eventItem.GSI1PK,
                    EventName: `Event ${eventId}`,
                    Venue: eventItem.VenueAddress || 'Venue not specified',
                    StartDate: eventItem.EventDate || 'Date not specified',
                    PosterURL: eventItem.EventThumbnail,
                    Description: `Event at ${eventItem.VenueAddress || 'venue location'}`
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