import { system, world } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui'

system.afterEvents.scriptEventReceive.subscribe(eventData => {

    const player = world.getAllPlayers().find(player => player.name == eventData.message)

    if (eventData.id == 'cs:waypoint') {

        const block = eventData.sourceBlock

        const waypoints = world.scoreboard.getObjective('waypoints')

        const isActive = block.permutation.getState('cs:active')

        function getWaypoint(x, y, z) {
            
            let gottenWaypoint = undefined

            waypoints.getParticipants().forEach(waypoint => {

                if (waypoint.displayName.split('|')[1] == `${x}` && waypoint.displayName.split('|')[2] == `${y}` && waypoint.displayName.split('|')[3] == `${z}` && waypoint.displayName.split('|')[4] == `${block.dimension.id}`) {

                    gottenWaypoint = waypoint
                }
            })

            return gottenWaypoint ?? false
        }

        let waypoint = getWaypoint(block.location.x, block.location.y, block.location.z)

        if (!waypoint) {

            player.runCommandAsync(`scoreboard players set "|${block.location.x}|${block.location.y}|${block.location.z}|${block.dimension.id}||0" waypoints 0`)
            waypoint = getWaypoint(block.location.x, block.location.y, block.location.z)
        }

        const waypointForm = new ModalFormData()
        waypointForm.title('Configure this Waypoint')
        waypointForm.toggle('Waypoint enabled', isActive)
        waypointForm.textField('Waypoint name', 'Mob Farm', waypoint.displayName.split('|')[0])
        waypointForm.textField('Who is allowed to use this waypoint? (seperate names with a comma or write \'public\' for public use)', `Fichi1657, ${player.name}`, waypoint.displayName.split('|')[5])

        waypointForm.show(player).then(r => {

            if (r.isCanceled) return

            let active = 0

            if (r.formValues[0]) {

                player.runCommandAsync(`setblock ${block.location.x} ${block.location.y} ${block.location.z} cs:waypoint ["cs:active":true]`)
                active = 1
            }
            else {

                player.runCommandAsync(`setblock ${block.location.x} ${block.location.y} ${block.location.z} cs:waypoint ["cs:active":false]`)
                active = 0
            }

            player.runCommandAsync(`scoreboard players reset "${waypoint.displayName}" waypoints`)
            player.runCommandAsync(`scoreboard players set "${r.formValues[1]}|${block.location.x}|${block.location.y}|${block.location.z}|${block.dimension.id}|${r.formValues[2].replaceAll(' ', '')}|${active}" waypoints 0`)
        })
    }
})

world.afterEvents.playerBreakBlock.subscribe(eventData => {

    const blockBefore = eventData.brokenBlockPermutation
    const block = eventData.block

    if (blockBefore.type.id == 'cs:waypoint') {

        const waypoints = world.scoreboard.getObjective('waypoints')

        function getWaypoint(x, y, z) {
            
            let gottenWaypoint = undefined

            waypoints.getParticipants().forEach(waypoint => {

                if (waypoint.displayName.split('|')[1] == `${x}` && waypoint.displayName.split('|')[2] == `${y}` && waypoint.displayName.split('|')[3] == `${z}` && waypoint.displayName.split('|')[4] == `${block.dimension.id}`) {

                    gottenWaypoint = waypoint
                }
            })

            return gottenWaypoint ?? false
        }

        let waypoint = getWaypoint(block.location.x, block.location.y, block.location.z)

        if (waypoint) {
            
            world.getDimension('minecraft:overworld').runCommandAsync(`scoreboard players reset "${waypoint.displayName}" waypoints`)
        }
    }
})