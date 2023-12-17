export function convertTo2DArray(array: Array<any>): any {
    if (array.length < 25) {
      throw new Error("The input array must have at least 25 elements.");
    }
  
    const result = [];
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        row.push(array[i * 5 + j]);
      }
      result.push(row);
    }
    return result;
  }

export function shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}
  