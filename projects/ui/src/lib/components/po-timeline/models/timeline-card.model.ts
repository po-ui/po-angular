/**
 * @description Cards exibidos na timeline
 */
export class TimeLineCard {
    
    /**
     * @description Título do Card
     */
    title: string;

    /**
     * @description Descrição do Card
     */
    description: string;

    /**
     * @description Lado em que o card será exibido na timeline (`left` ou `right`)
     */
    side: string;

    /**
     * @description Icone do botão na timeline referente a esse card
     */
    icon: string;

    /**
     * @description Cor do botão
     */
    color: string;
}