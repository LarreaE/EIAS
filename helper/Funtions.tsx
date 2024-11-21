

export const stringifyEffect = (effect: string) => {
    return effect
    .split('_') //split the string
    .map((word, index) =>
      index === 0 //cap first letter
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase()
    )
    .join(' ');
} 