import React from 'react';

function Bomb() {
    throw new Error('💥 CABOOM 💥');
    return null;
}
export default Bomb;