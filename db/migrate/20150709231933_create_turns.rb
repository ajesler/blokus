class CreateTurns < ActiveRecord::Migration
  def change
    create_table :turns do |t|
      t.references :player, index: true, foreign_key: true
      t.string :shape
      t.string :transform
      t.integer :x
      t.integer :y

      t.timestamps null: false
    end
  end
end
