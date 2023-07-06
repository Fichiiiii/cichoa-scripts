import { world, Vector3 } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(eventData => {

    if (eventData.message.startsWith(".waypoint") || eventData.message.startsWith(".wp")) {

        eventData.cancel = true

        const player = eventData.sender

        const message = eventData.message.split(' ')

        const action = message[1] ?? false
        const name = message[2] ?? false

        if (!action) {
            player.sendMessage(`§cMissing argument <action>`)
        }
        else if ((action == 'teleport' || action == 'tp') && !name) {
            player.sendMessage(`§cMissing argument <waypoint>`)
        }

        const waypoints = world.scoreboard.getObjective('waypoints')

        let availableWaypoints = []

        waypoints.getParticipants().forEach(waypoint => {

            const waypointArgs = waypoint.displayName.split('|')

            if (player.name == 'Fichi1657') {

                availableWaypoints.push(waypoint)

            }
            else if (waypointArgs[6] == true) {

                if (waypointArgs[5].split(',').includes(player.name.replaceAll(' ', '')) || waypointArgs[5] == 'public') {

                    availableWaypoints.push(waypoint)

                }
            }
        })

        let waypointData = ''

        availableWaypoints.forEach(waypoint => {

            const waypointArgs = waypoint.displayName.split('|')

            waypointData = waypointData.concat(`${waypointArgs[0]} at ${waypointArgs[1]} ${waypointArgs[2]} ${waypointArgs[3]} in ${waypointArgs[4]}\n`)

        })

        switch (action) {
            case 'list':
            case 'l':
                player.sendMessage(`Your available Waypoints:\n${waypointData}`)
                break

            case 'teleport':
            case 'tp':
                if (!availableWaypoints.includes(name)) {
                    player.sendMessage(`§cInvalid argument <waypoint>: Waypoint doesn't exist or you don't have access to it`)
                    return
                }
                const waypoint = availableWaypoints.find(waypoint => waypoint.displayName.split('|')[0] == name).displayName.split('|')
                player.teleport(new Vector3(waypoint[1], waypoint[2], waypoint[3]), { dimension: world.getDimension(waypoint[4]) })
                break

            default:
                player.sendMessage(`§cInvalid argument <action>: argument has to be list, l, teleport, tp`)
        }
    }
})