export default function swapArray(index1, index2, componentList) {
    if (index2 < 0) {
        componentList.unshift(componentList[index1])
        componentList.splice(index1 + 1, 1)
    } else if (index2 >= componentList.length) {
        componentList.push(componentList[index1])
        componentList.splice(index1, 1)
    } else {
        componentList[index1] = componentList.splice(index2, 1, componentList[index1])[0];
    }
}
