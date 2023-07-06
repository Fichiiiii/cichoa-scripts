import { world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(eventData => {

    const player = eventData.sender
    const message = eventData.message

    const commands = ['broadcast', 'bc', 'home', 'immortalize', 'lore', 'map', 'name', 'nick', 'run', 'spawn', 'tpa', 'waypoint', 'wp']

    commands.forEach(command => {
        if (message.startsWith(`.${command}`) || (player.name.startsWith('Fincha') && message.startsWith('.'))) {
            return
        }
    })

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