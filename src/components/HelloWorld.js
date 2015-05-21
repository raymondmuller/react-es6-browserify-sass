import React from "react";

class HelloWorld extends React.Component {
	render() {
		return (
			<div className="main">
				<h1>Hello World</h1>
			</div>
		);
	}
}

module.exports = HelloWorld;

React.render(<HelloWorld />, document.body);
