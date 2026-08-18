# Presenter script — Zubair Corporation Central E-Invoicing Hub walkthrough

A word-for-word script for demonstrating the prototype to the client.

**How to use it.** Lines in **“quotes and bold”** are meant to be said out loud, close to
as written. Lines marked *(do)* are what you click. Lines marked *(pause)* mean stop
talking for two seconds and let them look at the screen.

You do not have to say every sentence. Each screen has **one bold line that carries the
point**. If you are short of time, say only that line and move on.

**Timing.** About 30 minutes: 3 to open, 20 for the screens, 7 for questions.

---

## Before you start

Check these, five minutes before:

- Browser is full screen. Zoom at 100%. Close every other tab.
- Open `index.html`. The disclaimer appears. **Leave it on screen** — do not dismiss it
  until the client is watching. It is the first thing you want them to read.
- Have this script on a second screen or on paper. Do not read it from the same screen
  you are sharing.

Three habits that matter more than the words:

1. **Speak slower than feels natural.** Your listeners are also working in a second
   language for some of this. Slow is heard as confident.
2. **Say one sentence, then stop.** Short sentences are clearer than long ones. You do
   not need connecting words like *furthermore* or *subsequently*. “And” is fine.
3. **When you click, say what you clicked.** “Now I open the queue.” It gives you a
   half-second to think, and it keeps them with you.

---

## Opening — with the disclaimer on screen

> **“Before I show anything, please read this box.”**

*(pause — let them read, five seconds)*

> **“This is a prototype. It is not a working system. Every screen you will see is a
> picture, built in a browser. There is no server behind it, and no data is stored.”**

> **“Your company names are real, so that you recognise your own group. Every number is
> invented. Please do not read the figures as real figures.”**

> **“The purpose is simple. Instead of reading the design in a document, you can see it.”**

*(do — click **I understand**)*

> **“The walkthrough has eighteen screens, in six short parts. I will follow one invoice.
> It leaves an entity’s ERP, becomes a compliant e-invoice, is sent and reported, and
> comes back with its answer. Please stop me at any point.”**

*(do — click **Start the walkthrough**)*

---

# Act I — It starts in their system

## Screen 1 · Sales Invoices *(their ERP — SAP S/4HANA)*

**The one point:** their people keep working exactly as they do today.

> **“This is an entity’s own ERP. This is The Zubair Corporation LLC, and this is their
> SAP S/4HANA sales invoice list. Nothing on this screen changes.”**

> **“The user creates the invoice as normal. They post it as normal. They do not log in
> anywhere else, and they do not learn a new system.”**

*(point at the status column on the right)*

> **“Only one thing is added — this status column. It tells them what happened to the
> invoice after it was posted. That is the whole change for the finance user.”**

*(do — click **Next**)*

---

## Screen 2 · Counter & service sales *(their other ERP — Autoline 8.39)*

**The one point:** the same group has a second invoice origin, and it looks nothing like the first.

> **“This is a second entity, in a completely different system. This is General Automotive
> Company, and this is their Autoline dealer system — the counter and the service desk.”**

> **“The first screen was one large business invoice. This is the opposite. Thousands of
> small counter and service invoices, to walk-in customers, every day. Same VAT Group, the
> same Hub — a very different shape of invoice.”**

*(point at the batch note on screen)*

> **“These simplified B2C invoices are collected by Autoline and reported to the tax
> authority in batches, through the same Hub — not one at a time at the counter. We have
> flagged that batch handling as an assumption to confirm with you.”**

*(do — click **Next**)*

---

## Screen 3 · Signing in to the Hub

**The one point:** two different audiences, two different doors.

> **“This is the central hub. The group platform team signs in here.”**

> **“Notice the line under the title. The group team signs in here. A single entity’s
> finance user signs in somewhere else, in their own portal. I will show you that at
> the end.”**

> **“Nobody shares a login. Every entity gets its own.”**

*(do — click **Sign in**)*

---

# Act II — The group, and the entities in it

## Screen 4 · Group Dashboard

**The one point:** one screen answers “is the whole VAT Group compliant today?”

> **“This is the group view. Twelve entities, on one screen — all filing under one VAT
> Group TRN.”**

*(pause — let them look)*

> **“Today’s volume. Today’s failures. What is still in progress.”**

*(point at the alert about entities that have gone quiet)*

> **“This line is the important one. An entity has sent nothing today. It has not failed —
> it has gone silent. An entity that stops reporting is a compliance risk, and silence is
> easy to miss. The system watches for it and tells you.”**

> **“Without this, somebody has to remember to check twelve entities every day. On one
> shared VAT return, one silent entity is your whole group’s problem.”**

*(do — click **Next**)*

---

## Screen 5 · Entities

**The one point:** every entity is different, and that is handled.

> **“Every entity in the VAT Group is listed here. This is where you see how mixed the
> estate is.”**

> **“Four ERPs. SAP S/4HANA, Autoline, Orion, and FOCUS. Different connection details.
> Different rollout waves. One group return.”**

> **“The hub does not require anybody to change their ERP. It connects to what is already
> there.”**

*(do — click **Next**)*

---

## Screen 6 · One entity in detail — **the identity point**

**The one point:** the shared VAT number is not the identity. The CR is.

> **“This is one entity in detail. Its ERP, how it connects, and what it provided.”**

*(point at the two identifiers on the seller block)*

> **“Look at these two numbers. The VAT number, `OM1200094685`, is shared — all twelve
> entities file under it. But the Commercial Registration below it is this entity’s own.”**

*(pause)*

> **“That is the heart of the group case. On Peppol and on the invoice, each entity is
> identified by its own Commercial Registration. The shared VAT number is a data field.
> So twelve companies, twelve registrations, twelve endpoints — but one VAT return. That
> is exactly what a central hub is for.”**

> **“Everything else on this page is settings. No code was written for this entity.”**

*(do — click **Next**)*

---

# Act III — Bringing an entity on

## Screen 7 · Connecting a new entity

**The one point:** three ways to connect, so no entity is blocked.

> **“This is how a new entity is added. The first choice is how to connect it.”**

Say the three methods slowly. One line each:

> **“Method one. Direct connection, for a modern ERP with an interface — like SAP
> S/4HANA over its BAPI and integration layer.”**
> **“Method two. A small agent installed on their side, for an older on-premise system
> behind a firewall — like an Autoline dealer server.”**
> **“Method three. Secure file transfer, for a system with no interface at all.”**

> **“The method is chosen for each entity after we look at its ERP. We do not assume.”**

*(do — run the connection test on screen)*

> **“And the connection is tested before the entity goes live.”**

*(do — click **Next**)*

---

## Screen 8 · Mapping Studio

**The one point:** the hardest technical work is done by an analyst, not a developer.

> **“Every ERP calls its fields something different. Autoline, S/4HANA, Orion and FOCUS
> all name things their own way. The tax rules require one exact format. This screen is
> where the two are joined.”**

> **“On the left, their field. On the right, the standard field. In the middle, any
> conversion needed — a date format, a code, a decimal.”**

> **“An analyst does this by choosing from lists. No code is written.”**

*(do — click the **Derived** tab)*

> **“And these are the values we produce ourselves — including placing the entity’s
> Commercial Registration as the seller identifier and the shared VAT number as the VAT
> identifier. The entity does not have to supply that logic.”**

*(do — scroll to the live preview)*

> **“And here you can see the result immediately. Their data on the left. The official
> document on the right.”**

*(do — click **Next**)*

---

# Act IV — One invoice, end to end

## Screen 9 · Processing Queue

**The one point:** you always know where every document is.

> **“Every document being processed right now, and the stage it has reached — across all
> twelve entities and all four ERPs.”**

> **“There are nine stages. I want to point out two of them.”**

*(point at stage 5)*

> **“Stage five is Record. The document is stored **before** it is sent. So if the
> network fails, there is still proof of what we tried to send.”**

*(point at stage 9)*

> **“Stage nine is Archive. That is the long-term legal record. It comes last, because it
> contains the confirmations, and those arrive at the end.”**

*(point at the per-entity lanes)*

> **“And each entity has its own lane. General Automotive’s batch of simplified invoices
> from Autoline never delays anyone else. One entity’s problem never delays another.”**

*(do — click **Next**)*

---

## Screen 10 · Document Inspector

**The one point:** the document is proven correct before it leaves.

> **“This is the actual official document, and the check that was run on it.”**

*(point at the seller block in the XML)*

> **“Notice the seller. The Commercial Registration is the seller identifier; the shared
> group VAT number is the VAT identifier. Both are on the document, exactly as the Oman
> rules require.”**

> **“It is validated against the official Oman rule set before transmission. If it fails,
> it never goes to the network. It is stopped here.”**

*(do — click **Next**)*

---

## Screen 11 · Inbound Documents

**The one point:** nothing is ever posted into their accounts automatically.

> **“So far we followed an invoice going out. Supplier invoices also arrive.”**

> **“The document arrives, we identify which of the twelve entities it belongs to, we
> validate it, and we archive the original.”**

> **“Then it is delivered into that entity’s ERP as a **draft**.”**

*(pause)*

> **“It is never posted automatically. A person reviews it and approves it. We remove the
> typing, not the control.”**

*(do — click **Next**)*

---

## Screen 12 · Inbound Routing — **the addressing point**

**The one point:** twelve entities share one VAT number, so the VAT number cannot be the address.

> **“A supplier invoice has arrived for the group. The question is which of the twelve
> entities it is for. And here is the trap — all twelve share the one VAT number, so the
> VAT number cannot be the address.”**

*(point at the participant and CR on the routing row)*

> **“Each entity is its own Peppol participant, with its own address built from its own
> Commercial Registration. The Hub reads that address, matches the participant to the CR, to
> the exact entity — and only then drafts the document into that entity’s own ERP.”**

*(point at the held row)*

> **“And when a document does not match cleanly, it is not guessed. It is held here as
> unmatched, for a person to resolve. It is never posted into the wrong entity.”**

*(do — click **Next**)*

---

## Screen 13 · Processing History

**The one point:** every document can be found and proven, later.

> **“Everything that has been processed, in both directions, searchable.”**

> **“For any document you can see what is held in the archive — the document itself, the
> validation result, the confirmations, and the full timeline.”**

> **“This is what you would show an auditor.”**

*(do — click **Next**)*

---

## Screen 14 · Reports

**The one point:** the data supports the VAT return and the exceptions review.

> **“VAT summaries. Reporting completeness. How long exceptions have been open.”**

> **“The point of this screen is that the compliance data is in one place, for all twelve
> entities, rolled up to the one VAT Group return — and it can be exported.”**

*(do — click **Next**)*

---

# Act VI — What each entity gets

## Screen 15 · Users & Access

**The one point:** the central team never holds an entity’s password.

> **“Each entity administers its own users.”**

> **“The central team sends one invitation. The person sets their own password and their
> own second factor. After that, the entity adds and removes its own people.”**

> **“The central team can configure the hub. It cannot post anything into any ERP.”**

*(do — click **Next**)*

---

## Screen 16 · An entity signs in

> **“Now I will stop being the group team. I will sign in as one entity.”**

*(do — click **Sign in**)*

---

## Screen 17 · What that entity sees

**The one point:** strict separation. This is usually the moment that convinces people.

> **“This is The Zubair Corporation LLC’s own portal.”**

*(pause)*

> **“They see their own invoices. Their own supplier invoices. Their own exceptions.
> Their own users.”**

> **“They cannot see the other eleven entities. Not the volumes, not the names, not the
> failures. Each entity sees only itself — even though they all share the one VAT
> number.”**

*(do — click **Next**)*

---

## Screen 18 · Back on the invoice — **the scope boundary**

**This is the most important screen commercially. Do not rush it. Read the red box
before you say anything else.**

> **“This is the last screen. It is the same invoice we started with, in the same SAP
> S/4HANA. It is invoice `ZCL-SINV-2026-00841`.”**

*(do — point at the red box, and pause)*

> **“Before I describe it, please read this red note.”**

*(pause — five seconds)*

> **“The invoice now shows the reference, the status and the QR information. But I have to
> be very clear about who builds that part.”**

Say these four lines slowly. This is the part you must not soften:

> **“We make all of these values available at our interface.”**
> **“Reading them from us, and writing them into the ERP, is work for your ERP team or
> your ERP vendor. It is not in our scope.”**
> **“The same applies to supplier invoices arriving as drafts. Creating the draft inside
> the ERP is ERP-side work.”**
> **“If you would like us to build that part as well, we will quote it separately.”**

*(pause — let them react. Do not fill the silence.)*

> **“Everything else you have seen — the mapping, the document, the validation, the
> transmission, the reporting, the archive, the dashboards — is delivered by us.”**

---

## Closing

> **“That is the walkthrough. One invoice, from an entity’s ERP, to the tax authority,
> and back again.”**

> **“Three things I would like you to remember.”**

> **“One. Your people keep working in their own system.”**
> **“Two. The compliance work is solved once, centrally, for all twelve entities and four
> ERPs — not twelve times, and not once per ERP.”**
> **“Three. Each entity sees only its own data, even under one shared VAT number.”**

> **“Please remember this was a prototype with invented numbers. What is real is the
> design. Thank you. What questions do you have?”**

---

# Questions you should expect

Keep the answers short. A short answer sounds certain.

**“Is this already built?”**
> **“No. This is a prototype of the design. It shows what we are proposing to build.”**

**“Is the data real?”**
> **“Your company names are real. Every number is invented for the demonstration.”**

**“We all share one VAT number. How does the tax authority tell the entities apart?”**
> **“By each entity’s own Commercial Registration. On the invoice and on Peppol, the CR
> is the seller identity; the shared VAT number is a data field. Twelve registrations,
> one return. We can walk you through the exact business terms if useful.”**

**“Do our entities have to change their ERP?”**
> **“No. We connect to what is already there. That is why there are three connection
> methods, and why the hub reads all four of your ERPs.”**

**“What about the huge volume of counter sales in the dealerships?”**
> **“Those simplified invoices are reported to the tax authority in batches from Autoline,
> not one at a time at the counter. We have flagged that as an assumption to confirm with
> you against the Oman simplified-invoice rules.”**

**“What happens if the network or the provider is down?”**
> **“The document is already stored before we send it. It is retried automatically. And
> nothing is lost, because we archive before transmission, not after.”**

**“Can the central team see or change our accounting data?”**
> **“The central team can configure the hub. It cannot post anything into any ERP.
> Posting stays with your own finance users.”**

**“Can one entity see another entity’s data?”**
> **“No. I showed you that on the portal screen. Each entity sees only itself.”**

**“Who builds the ERP side?”**
> **“Your ERP team or your ERP vendor. If you want us to do it, we will quote it as a
> separate piece of work.”**

**“How long does it take to add one entity?”**
> **“That depends on the ERP and on the data. What I can say is what you saw — it is
> configuration, not a new installation for each entity.”**

**A question you cannot answer.** Do not guess. Say:
> **“That is a good question. I do not want to give you a wrong answer. Let me confirm it
> and come back to you in writing.”**

Then write it down, visibly. Writing it down in front of them is reassuring.

---

# If something goes wrong

**A screen looks broken or a number looks odd.**
> **“This is a prototype, so please ignore that. The point of this screen is …”**
Then say the one bold line for that screen.

**You lose your place.**
Look at the top right. It says which step you are on. Then say:
> **“Let me go back one screen.”**
Use the **Previous** button. Going back is normal, not a mistake.

**They ask about price or timeline.**
> **“The commercial details are in the proposal. Today I would like to focus on whether
> the design is right for you.”**

**They go quiet.**
Silence usually means they are reading. Let it run. If it lasts more than a few seconds:
> **“Shall I move on, or would you like to look at this one for longer?”**

---

# Two-minute version

If your time is cut short, show four screens only:

1. **Group Dashboard** — “Twelve entities, one VAT return, one screen. And it tells you
   when an entity goes silent.”
2. **Entity detail** — “Shared VAT number, but each entity’s own Commercial Registration
   is the identity. That is why one hub, not twelve installs.”
3. **Entity portal** — “Each entity sees only its own data.”
4. **The last ERP screen** — read the red scope box.

That is the whole argument.
