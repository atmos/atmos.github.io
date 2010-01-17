--- 
layout: post
title: A Specification Pattern in Rails
---
I've been swamped at work for the past two months writing a billing system for a health care app.  It's been challenging to say the least.  I've been pairing with our oracle dba who, despite his love for oracle, is fucking brilliant and has been guiding the development of this part of our app exceptionally well.  I come in every day to him saying "next we need it to do this", we implement it, test it, and move on.  This isn't a simple invoice system, depending on the where a client was treated, by whom, for how long, the type of treatment and a few other things various payers may or may not cover certain treatments.  So one day I came into work groggy as hell to hear my dba say "hey we need to put some code in the database."  This woke me up quickly.  "Wait, Why?" I asked.  His response was that nearly every payer in our system is going to have slightly different business logic in deciding whether or not they'll cover certain things.  He drew out this little decision tree as an example.  I couldn't help but think, "he wants to throw a chunk of ruby in a text column and eval it."  I didn't know what to tell him at the time, but I knew I didn't want to eval code from a text column.  Luckily I work with this really smart dude, "Rick Bradley":http://www.rickbradley.com.  Rick had already implemented something *sorta* like what we needed for another part of our app, it was based on an old "Martin Fowler":http://www.martinfowler.com paper called "Specifications":http://www.martinfowler.com/apsupp/spec.pdf.

What we ended up using was described as the validation portion of the specification problem.
bq. Validation: You need to check that only suitable objects are used for a certain purpose

The solution turns out to be quite elegant.
bq. Create a specification that is able to tell if a candidate object matches some criteria. The specification has a method isSatisfiedBy (anObject) : Boolean that returns true if all criteria are met by anObject.

I knew I needed some sort of decision tree, and most things break down to a left hand side and a right hand side.  With this I can do basic and, or, and not logic.  I just needed a little STI model for specification and the other types would just inherit from the Specification class.  So I declared it like this.

<filter:jscode lang="ruby">
class Specification < ActiveRecord::Base
  validates_presence_of :lhs_id

  # does object satisfy this Specification?
  def is_satisfied_by?(object)
    false
  end
end
</filter:code>

That's all there is to the base class.  It requires that a left hand side of the expression be present, and since we'll never have an instance of a Specification around, the default is_satisfied_by? method is false.  Next I needed what we called a LeafSpecification, something that sits at the branches of the decision tree and evaluates the rules.  It looks like this.
<filter:jscode lang="ruby">
class LeafSpecification < Specification
  belongs_to :lhs, :class_name => "SpecificationRule", :foreign_key => 'lhs_id'
  def is_satisfied_by?(object, &block)
    self.lhs.is_satisfied_by?(object, &block)
  end
end
</filter:code>

Doing the logic portion of combining a bunch of leaves is dead simple.  Check it.
<filter:jscode lang="ruby">
class NotSpecification < Specification
  belongs_to :lhs, :class_name => "Specification", :foreign_key => "lhs_id"
  def is_satisfied_by?(object, &block)
    !self.lhs.is_satisfied_by?(object, &block)
  end
end

class CompositeSpecification < Specification
  validates_presence_of :rhs_id
  belongs_to :rhs, :class_name => "Specification", :foreign_key => "rhs_id"
  belongs_to :lhs, :class_name => "Specification", :foreign_key => "lhs_id"
end

class AndSpecification < CompositeSpecification
  def is_satisfied_by?(object, &block)
    self.lhs.is_satisfied_by?(object, &block) and self.rhs.is_satisfied_by?(object, &block)
  end
end

class OrSpecification < CompositeSpecification
  def is_satisfied_by?(object, &block)
    self.lhs.is_satisfied_by?(object, &block) or self.rhs.is_satisfied_by?(object, &block)
  end
end
</filter:code>

Basically we have a link to another table that's STI also which can contain various SpecificationRule instances.  By inheriting from SpecificationRule I can define classes that do exactly what I need in certain instances, "has this client been seen 3 times in the last 90 days", "have certain evaluations been issued recently", and "are they older than 20 years."  The SpecificationRule looks an awful lot like the Specification class itself, but it's in a different table and there's no left hand side of the expression.  Here's a SpecificationRule and an example child that I might actually use in a ruleset.
<filter:jscode lang="ruby">
class SpecificationRule < ActiveRecord::Base
  def is_satisfied_by?(object, &block)
    yield self, object if block_given?
  end
end
class SpecificationRuleSeenInLast90Days < SpecificationRule
  def is_satisfied_by?(object, &block)
    ScheduleEntry.count(:conditions => ['client_id = ? AND begin_time > ? AND status_id = ?', object[:client].id, 90.days.ago, 1]) > 0
  end
end
</filter:code>

While the SpecificationRule isn't very interesting, the SpecificationRuleSeenInLast90Days is(though the name is pretty fugly).  The object that's passed in is actually a hash, this allows our various rules to get different objects and pick which ones are important to satisfying them.  In this case we want a client object to be present in the hash, and we can do a little query to see if they've been seen in the last 90 days.

It ends up being pretty straightforward to define a few SpecificationRules that can be used as leaves in the Specification.  At first this struck me as odd.  "Define a class for every rule, wtf?"  It's not that bad though:
* Each rule can be tested individually
* Rules can be reused by various parts of the system
* Entire rulesets can be tested with a little bit of mocking/stubbing

Some obvious cons are floating around with this approach too.
* If you need a new SpecificationRule subclass, you will have to redeploy
* It's not going to be as fast as if you'd written a chunk of code for it

In our payer model we basically have something like the following.
<filter:jscode lang="ruby">
class Payer
  has_one :specification

  def will_cover_visit(entry)
    self.specification.is_satisfied_by?(entry.client)
  end
end
</filter:code>

Thusfar it's working out pretty well for us.  I'm sure there's tons of ways to improve upon it, but we have other pressing things right now.  So we moved on. :)
