import { system, world } from '@minecraft/server'

system.runInterval(() => {
    const borderRadius = Math.abs(world.getDynamicProperty("border")) / 2 || 125

    world.getAllPlayers().forEach(player => {
        if (player.hasTag("noclip")) return

        if (Math.abs(player.location.x) > borderRadius || Math.abs(player.location.z) > borderRadius) {
            const ridingEntity = player.getComponent('riding')?.entityRidingOn
            if (ridingEntity) {
                ridingEntity.teleport({ x:0, y:66, z:0 })
            }
            else {
                let directionX = 0
                let directionZ = 0

                if (player.location.x > borderRadius) directionX = -1
                if (player.location.x < -borderRadius) directionX = 1

                if (player.location.z > borderRadius) directionZ = -1
                if (player.location.z < -borderRadius) directionZ = 1

                player.applyKnockback(directionX, directionZ, 5, 1)
            }
        }
    })
}, 10)
