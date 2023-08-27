import { world } from "@minecraft/server"

world.afterEvents.playerSpawn.subscribe(eventData => {

    if (eventData.player.hasTag("firstTimeJoin")) return

    world.scoreboard.getObjective('chunkTokens')
        .setScore(eventData.player.scoreboardIdentity, 1)

    eventData.player.addTag("firstTimeJoin")
})
