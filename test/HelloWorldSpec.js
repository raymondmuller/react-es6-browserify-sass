import React from "react";
import ReactTestUtils from "react/lib/ReactTestUtils";
import assert from "assert";

import HelloWorld from "../src/components/HelloWorld";

describe("HelloWorld", function () {
	it("should exist in the dom", function () {
		let instance = ReactTestUtils.renderIntoDocument(
			<HelloWorld>
				<br/>
			</HelloWorld>
		);
		assert.ok(ReactTestUtils.findRenderedDOMComponentWithClass(instance, "main"));
	});
});
