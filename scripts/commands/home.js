import { world, Vector } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(eventData => {

    const player = eventData.sender

    if (eventData.message.startsWith('.home')) {

        eventData.cancel = true

        let spawnDimension, spawnPosition
        spawnDimension = player.spawnDimension.id.split(':')[1] ?? 'overworld'
        spawnPosition = player.getSpawnPosition() ?? new Vector(0, 88, 0)
        
        player.runCommandAsync(`execute in ${spawnDimension} run tp @s ${spawnPosition.x} ${spawnPosition.y} ${spawnPosition.z}`)

    }
})