import React from 'react';

interface propType {
    key?: number,
    title: string
    props: any,
}
const Text = (props: propType) => {

    const { title } = props;

    const renderButton = () => {
        return (
            <div className=" h-32">
                <h1>{title}</h1>
            </div>
        )
    }

    return (
        <div>
            {renderButton()}
        </div>
    );
}

export default Text;
