CREATE OR REPLACE VIEW expense_types_altered AS
select expensetypeid, description as type_description, category from expensetypes;

CREATE OR REPLACE VIEW expenses_with_categories AS
select * FROM expenses left join expense_types_altered on expenses.expensetype = expense_types_altered.expensetypeid;