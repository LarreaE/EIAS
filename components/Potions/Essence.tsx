import Potion from './Potion';

class Essence extends Potion{

    constructor(
        _id: string,
        name: string,
        description: string,
        image: string,
        type: string,
        value: number ,
    ) {
        super(_id,name,description,image,type,value);
    }
}

export default Essence;
