import { world } from '@minecraft/server'

world.afterEvents.entityDie.subscribe(eventData => {

    const player = eventData.deadEntity

    if (player.typeId === 'minecraft:player') {

        let name = player.name

        if (name == 'ChangeThema1') { name = 'Change' }

        player.runCommandAsync(`scoreboard players add "${name + '​'}" deaths 1`)
    }
})

world.beforeEvents.chatSend.subscribe(eventData => {

    const player = eventData.sender

    if (player.name === 'Fincha5' && eventData.message.startsWith('.deathCounter')) {

        eventData.cancel = true

        const scoreboard = world.scoreboard.getObjective('deaths')

        const deaths = scoreboard.getParticipants().map(participant => [participant.displayName, scoreboard.getScore(participant)]).sort((a, b) => b[1] - a[1])

        player.runCommandAsync(`w @s top ten deaths: ${deaths.slice(0, 10).map(death => `${death[0]} with ${death[1]} deaths`).join(', ')}`)
    
    }
})