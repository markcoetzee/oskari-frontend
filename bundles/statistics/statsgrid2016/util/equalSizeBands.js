export default function equalSizeBands (classCount, min, max) {
    var output = [];
    var step = (max - min) / classCount;

    for (var i = 0; i < classCount; i++) {
        output.push(min + step * i);
    }

    output.push(max);
    return output;
}
