require 'rails_helper'

RSpec.describe Transforms do
	let(:expected_transform_count) { 8 }

	describe ".names" do
		subject { Transforms.names }

		it "should return the transforms names" do
			is_expected.to be_present
			is_expected.to have_attributes(:size => expected_transform_count)
			is_expected.to include("identity", "rotate_180")
		end
	end

	describe ".transforms" do
		subject { Transforms.transforms }

		it "should return the transforms" do
			is_expected.to be_present
			is_expected.to have_attributes(:size => expected_transform_count)
		end
	end

	describe ".[]" do
		subject { Transforms[transform_name] }

		context "with a recognised shape name" do
			let(:transform_name) { "identity" }

			it "should return the transform" do
				is_expected.to_not be_nil
				is_expected.to have_attributes(:name => transform_name)
			end
		end

		context "with an unrecognised transform name" do
			let(:transform_name) { "not_a_transform" }

			it { is_expected.to be_nil }
		end
	end
end