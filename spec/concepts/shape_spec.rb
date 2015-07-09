require 'rails_helper'

RSpec.describe Shape do
	let(:name) { :test_shape }
	let(:definition) { Matrix[[1, 1, 2, 0, 1],[0, 1, 1, 2, 2]] }
	let(:shape) { Shape.new(name, definition) }

	describe "#name" do
		subject { shape.name }

		it { is_expected.to be_present }
	end

	describe "#definition" do
		subject { shape.definition }

		it { is_expected.to be_present }
	end

	describe "#size" do
		subject { shape.size }

		it { is_expected.to eq 5 }
	end
end