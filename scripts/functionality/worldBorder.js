import { system, world } from '@minecraft/server'

system.runInterval(() => {
    const scoreboard = world.scoreboard.getObjective('border')

    const diameter = scoreboard.getScore(scoreboard.getParticipants().find(participant => participant.displayName == "overworld")) ?? 250

    const borderRadius = Math.abs(diameter / 2)

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
