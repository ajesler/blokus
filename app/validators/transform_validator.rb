class TransformValidator < ActiveModel::EachValidator
	def validate_each(record, attribute, value)
		valid_transform_name = value.nil? || Transforms.names.include?(value)
		record.errors.add attribute, " must be a recognised transform name." unless valid_transform_name
	end
end