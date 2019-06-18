CREATE OR REPLACE VIEW expense_types_altered AS
select expensetypeid, description as type_description, category from expensetypes;

CREATE OR REPLACE VIEW expenses_with_categories AS
select * FROM expenses left join expense_types_altered on expenses.expensetype = expense_types_altered.expensetypeid;

create or replace view user_expense_report as
select e.expensedate, e.amount, e.description as expensedescription, e.createdby, t.description as typedescription,
c.description as categorydescription, e.houseid
from expenses e, expensetypes t, expensecategories c
where e.expensetype = t.expensetypeid and t.category = c.categoryid