import { world } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui'

let passwordForm = new ModalFormData()
passwordForm.title("Coming Soon");
passwordForm.textField("Beta User Password", "Enter the password")

world.afterEvents.entityHit.subscribe(eventData => {

    const player = eventData.entity
    const entity = eventData.hitEntity

    if(!entity) return

    if (entity.typeId == 'cs:quaza') {

        passwordForm.show(player).then(r => {

            if (r.isCanceled) return

            if (r.formValues[0] === "isa kinda cute") {
                player.sendMessage('Woah you actually got it\nSend me a screenshot of this message to get something\n\nLove ya :3')
            }
            else {
                player.sendMessage('§cWrong password')
            }
        })
    }
})