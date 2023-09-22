import { world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(eventData => {

    const player = eventData.sender
    const message = eventData.message

    if (message.startsWith('.')) return

    eventData.cancel = true

    if (player.hasTag('owner')) {

        world.sendMessage(` <${player.nameTag}> ${message}`)
    }
    else if (player.hasTag('admin')) {

        world.sendMessage(` <${player.nameTag}> ${message}`)
    }
    else {

        world.sendMessage(` <${player.nameTag}> ${message}`)
    }
})