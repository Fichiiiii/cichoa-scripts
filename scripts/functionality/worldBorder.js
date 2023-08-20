import { system, world } from '@minecraft/server'

const borderRadius = 200

system.runInterval(() => {
    world.getAllPlayers().forEach(player => {
        if (player.hasTag("staff")) return

        if (Math.abs(player.location.x) > borderRadius || Math.abs(player.location.z) > borderRadius) {
            let directionX = 0
            let directionZ = 0

            if (player.location.x > borderRadius) directionX = -1
            if (player.location.x < -borderRadius) directionX = 1

            if (player.location.z > borderRadius) directionZ = -1
            if (player.location.z < -borderRadius) directionZ = 1

            player.applyKnockback(directionX, directionZ, 5, 1)
        }
    })
}, 30)
