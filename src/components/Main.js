var React = require('react');

class Main extends React.Component {
	render() {
		return (
			<div className="main">
				<h1>Hello World</h1> 
			</div>
		) 
	}
}

module.exports = Main

React.render(<Main />, document.body);