import { world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(async (eventData) => {

    if (eventData.sender.name === 'Fincha5' && eventData.message.startsWith('.playerlist')) {

        eventData.cancel = true

        let playerNames = world
            .getAllPlayers()
            .map(member => member.name)
            .join(',');

        eventData.sender.runCommandAsync(`w Fincha5 players currently online: ${playerNames}`)
    }
})