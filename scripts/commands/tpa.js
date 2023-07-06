import { system, world } from '@minecraft/server'

function tpaScoreboard(player1, player2) {

    const scoreboardName = `${player1.name}:${player2.name}`

    system.run(() => {

        world.scoreboard.addObjective(`${scoreboardName}`, `${scoreboardName}`)

        system.runTimeout(() => {

            if (world.scoreboard.getObjective(`${scoreboardName}`)) {

                world.scoreboard.removeObjective(`${scoreboardName}`)

                player1.sendMessage("§cYour request has expired.")
                player2.runCommandAsync(`§cThe request of ${player1.name} has expired.`)

            }
        }, 20 * 60)
    })
}

world.beforeEvents.chatSend.subscribe(eventData => {

    if (eventData.message.startsWith('.tpa')) {

        eventData.cancel = true

        const player = eventData.sender

        const message = eventData.message.split(' ')

        const action = message[1] ?? false
        const name = message.slice(2).join(' ')

        if (!action) {
            player.sendMessage("§cMissing argument <action>")
            return
        } 
        else if (!name) {
            player.sendMessage("§cMissing argument <player>")
            return
        }

        const user = world.getAllPlayers().find(player => player.name == name) ?? player

        if (player.name == user.name) {
            player.sendMessage("§cInvalid argument <player>: You can't teleport to this player")
            return
        }

        const scoreboardName = `${player.name}:${user.name}`

        switch (action) {
            case 'request':
            case 'r':
                player.sendMessage(`Your request was sent to ${user.name}.\n§cThis request will expire in 60 seconds.`)
                user.sendMessage(`${player.name} has requested to teleport to you.\nType '.tpa accept ${player.name}' to accept or '.tpa deny ${player.name}' to deny.\n§cThis request will expire in 60 seconds.`)
                tpaScoreboard(user, player)
                return

            case 'accept':
            case 'a':
                if (world.scoreboard.getObjective(scoreboardName)) {
                    player.sendMessage(`Your request was  accepted by ${user.name}.\n§cThey will be teleported in 3 seconds.`)
                    user.sendMessage(`You accepted the request of ${player.name}.\n§cYou will be teleported in 3 seconds.`)

                    system.runTimeout(() => {
                        player.runCommandAsync(`tp "${user.name}" "${player.name}"`)
                    }, 20 * 3)
                }
                break

            case 'deny':
            case 'd':
                if (world.scoreboard.getObjective(scoreboardName)) {
                    player.sendMessage(`§cYour request was denied by ${user.name}.`)
                    user.sendMessage(`§cYou denied the request of ${player.name}.`)
                }
                break
                
            default:
                player.sendMessage("§cInvalid argument <action>: argument has to be request, r, accept, a, deny or d")
        }

        system.run(() => {
            world.scoreboard.removeObjective(scoreboardName)
        })
    }
})
