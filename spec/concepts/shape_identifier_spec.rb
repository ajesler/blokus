require 'rails_helper'

RSpec.describe ShapeIdentifier do
	describe ".identify" do
		subject { ShapeIdentifier.identify(shape_to_identify) }

		context "with a known shape" do
			let(:shape) { Shapes["F"] }
			let(:shape_to_identify) { shape.definition }

			context "with no transforms applied" do
				it "should identify the shape" do 
					is_expected.to eq shape.name
				end
			end

			context "with an transform applied" do
				let(:shape_to_identify) { Matrix[[9, 8, 9, 10, 8], [8, 9, 9, 9, 10]] }

				it "should identify the shape" do
					is_expected.to eq shape.name
				end
			end
		end

		context "with an unknown shape" do
			let(:shape_to_identify) { Matrix[[0, 1, 0, 2, 1], [0, 0, 1, 1, 2]] }

			it { is_expected.to be_nil }
		end
	end
end