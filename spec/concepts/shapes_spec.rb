require 'rails_helper'

RSpec.describe "Shapes" do
	let(:expected_shape_count) { 21 }

	describe ".names" do
		subject { Shapes.names }

		it "should return the shapes names" do
			is_expected.to be_present
			is_expected.to have_attributes(:size => expected_shape_count)
			is_expected.to include("L4", "2", "I4", "W")
		end
	end

	describe ".shapes" do
		subject { Shapes.shapes }

		it "should return the shapes" do
			is_expected.to be_present 
			is_expected.to have_attributes(:size => expected_shape_count)
		end
	end

	describe ".[]" do
		let(:shape_name) { "W" }

		subject { Shapes[shape_name] }

		context "with a recognised shape name" do
			it "should return the shape" do
				is_expected.to_not be_nil
				is_expected.to have_attributes(:name => shape_name)
			end
		end

		context "with an unrecognised shape name" do
			let(:shape_name) { "unrecognised_shape_name" }

			it { is_expected.to be_nil }
		end
	end
end