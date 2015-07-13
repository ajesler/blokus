class Colours
	def self.colours
		COLOURS
	end

	def self.[](index)
		COLOURS[index]
	end

	private

	COLOURS = [:blue, :yellow, :red, :green]
end