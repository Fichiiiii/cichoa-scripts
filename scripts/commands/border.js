import { system, world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(async (eventData) => {

    const player = eventData.sender

    if (eventData.message.startsWith('.border') && player.hasTag('staff')) {

        eventData.cancel = true

        const scoreboard = world.scoreboard.getObjective('border')

        const overworld = scoreboard.getParticipants().find(participant => participant.displayName == "overworld")

        const border = scoreboard.getScore(overworld) ?? 0

        const message = eventData.message.split(' ')

        const action = message[1] ?? false
        const number = parseInt(message[2])

        if (!action) {
            return player.sendMessage("§cMissing argument <action>")
        } else if ((action == 'set' || action == 'add') && isNaN(number)) {
            return player.sendMessage(`§cMissing argument <number>`)
        }

        let newBorder = border

        switch (action) {
            case "set":
                system.run(() => {
                    scoreboard.setScore(overworld, number)
                })
                newBorder = number
                break

            case "add":
                system.run(() => {
                    scoreboard.addScore(overworld, number)
                })
                newBorder += number
                break
                
            default:
                return player.sendMessage(`§cInvalid argument <action>: argument has to be set or add`)
        }

        world.sendMessage(`§aSet the world border from ${border}x${border} to ${newBorder}x${newBorder}`)
    }
})