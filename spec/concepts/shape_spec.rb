require 'rails_helper'

RSpec.describe Shape do
	let(:name) { :test_shape }
	let(:definition) { Matrix[[1, 1, 2, 0, 1],[0, 1, 1, 2, 2]] }
	let(:shape) { Shape.new(name, definition) }

	describe "#size" do
		subject { shape.size }

		it "should return the number of squares in the shape" do
			is_expected.to eq 5
		end
	end
end