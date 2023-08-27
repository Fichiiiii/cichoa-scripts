import { system, world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(eventData => {

    if (eventData.message.startsWith(".ddb") && eventData.sender.hasTag('staff')) {

        eventData.cancel = true

        const player = eventData.sender

        const message = eventData.message.split(' ')

        const auth = message[1]

        if (!auth) {
            player.sendMessage(`§cMissing argument <authorization>`)
        }
        else if (auth == 'yes-i-am-sure-i-want-to-do-this') {
            system.run(() => {
                world.setDynamicProperty("chunks", "")
            })
            
            player.sendMessage(`§aSuccesfully deleted the Database`)
        } else {
            player.sendMessage(`§cWrong argument <authorization>`)
        }
    }
})
