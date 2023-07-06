import { world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(eventData => {

    const player = eventData.sender
    const message = eventData.message

    const commands = ['broadcast', 'bc', 'home', 'immortalize', 'lore', 'map', 'name', 'nick', 'run', 'spawn', 'tpa', 'waypoint', 'wp']

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
