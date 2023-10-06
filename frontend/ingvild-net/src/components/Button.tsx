import React from 'react';
import '../App.css';

interface Props {
  type?: 'button' | 'submit';
  children?: React.ReactNode;
  classnames?: string;
  id?: string;
  onClick?: () => void;
}

function Button({ 
    type,
    children,
	classnames,
	id,
    onClick
  }: Props) {

	const combinedClassNames = `Button ${classnames || ''}`.trim();

	console.log(combinedClassNames);

    if (type === "submit") {
        return (
			<button id={id} className={combinedClassNames} type={type}>
				{children}
			</button>
        )
    }
    else {
		return (
			<button id={id} type={type} className={combinedClassNames} onClick={onClick}>
				{children}
			</button>
		)
    }
}

export default Button;
