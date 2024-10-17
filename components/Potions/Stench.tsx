import Potion from './Potion';

class Stench extends Potion{

    constructor(
        _id: string,
        name: string,
        description: string,
        image: string,
        type: string,
        value: number ,
    ) {
        super(_id,name,description,image,type,value);
        this._id = _id;
        this.description = description;
        this.image = image;
        this.type = type;
        this.name = name;
        this.value = value;
    }
}

export default Stench;
