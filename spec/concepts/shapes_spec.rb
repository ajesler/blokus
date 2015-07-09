require 'rails_helper'

RSpec.describe "Shapes" do
	let(:expected_shape_count) { 21 }

	describe ".names" do
		subject { Shapes.names }

		it { is_expected.to be_present }
		it { is_expected.to have_attributes(:size => expected_shape_count) }
		it { is_expected.to include(:cross, :space_ship, :ewe) }
	end

	describe ".shapes" do
		subject { Shapes.shapes }

		it { is_expected.to be_present }
		it { is_expected.to have_attributes(:size => expected_shape_count) }
	end

	describe ".[]" do
		let(:shape_name) { :space_ship }

		subject { Shapes[shape_name] }

		context "with a recognised shape name" do
			it { is_expected.to_not be_nil }
			it { is_expected.to have_attributes(:name => shape_name) }
		end

		context "with an unrecognised shape name" do
			let(:shape_name) { :unrecognised_shape_name }

			it { is_expected.to be_nil }
		end
	end
end