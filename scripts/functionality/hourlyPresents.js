import { system, world } from '@minecraft/server'

system.afterEvents.scriptEventReceive.subscribe(eventData => {

    const player = world.getAllPlayers().find(player => player.name == eventData.message)

    if (eventData.id == 'cs:fettuchini') {

        const scoreboard = world.scoreboard.getObjective('hourlyPresent')

        if (scoreboard.getScore(player.scoreboardIdentity) >= 72000) {

                player.runCommandAsync(`scoreboard players add @s hourlyPresent -72000`);
                player.runCommandAsync(`give @s cs:present`);
                player.sendMessage(`§aYou have redeemed an hourly present!`);
        }
        else {

            player.sendMessage(`§cYou can redeem an hourly present in ${(72000 - scoreboard.getScore(player.scoreboardIdentity)) / 20 / 60} minutes`)
        }
    }
})