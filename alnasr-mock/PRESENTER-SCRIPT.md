# Presenter script — Al Nasr Compliance Hub walkthrough

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

> **“The company names are real, so that you recognise your own group. Every number is
> invented. Please do not read the figures as real figures.”**

> **“The purpose is simple. Instead of reading the design in a document, you can see it.”**

*(do — click **I understand**)*

> **“The walkthrough has sixteen screens, in six short parts. I will follow one
> invoice. It leaves a company’s ERP, becomes a compliant e-invoice, is sent and
> reported, and comes back with its answer. Please stop me at any point.”**

*(do — click **Start the walkthrough**)*

---

# Act I — It starts in their system

## Screen 1 · Sales Invoices *(their ERP)*

**The one point:** their people keep working exactly as they do today.

> **“This is a company’s own ERP. This is Al Nasr Marbles, and this is their sales
> invoice list. Nothing on this screen changes.”**

> **“The user creates the invoice as normal. They submit it as normal. They do not log
> in anywhere else, and they do not learn a new system.”**

*(point at the status column on the right)*

> **“Only one thing is added — this status column. It tells them what happened to the
> invoice after it was submitted. That is the whole change for the finance user.”**

*(do — click **Next**)*

---

## Screen 2 · Signing in to the Hub

**The one point:** two different audiences, two different doors.

> **“This is the central platform. The group team signs in here.”**

> **“Notice the line under the title. The group team signs in here. A single company’s
> finance user signs in somewhere else, in their own portal. I will show you that at
> the end.”**

> **“Nobody shares a login. Every company gets its own.”**

*(do — click **Sign in**)*

---

# Act II — The group, and the companies in it

## Screen 3 · Group Dashboard

**The one point:** one screen answers “is the whole group compliant today?”

> **“This is the group view. All four companies, on one screen.”**

*(pause — let them look)*

> **“Today’s volume. Today’s failures. What is still in progress.”**

*(point at the alert about companies that have gone quiet)*

> **“This line is the important one. Two companies have sent nothing today. They have
> not failed — they have gone silent. A company that stops reporting is a compliance
> risk, and silence is easy to miss. The system watches for it and tells you.”**

> **“Without this, somebody has to remember to check every company every morning. Nobody
> does that every day.”**

*(do — click **Next**)*

---

## Screen 4 · Companies

**The one point:** every company is different, and that is handled.

> **“Every company in the group is listed here. This is where you see how mixed the
> estate is.”**

> **“Different systems. ERPNext, SAP Business One, an on-premise project accounting suite, and a job-costing export.
> Different connection methods. Different rollout waves.”**

> **“The platform does not require anybody to change their ERP. It connects to what is
> already there.”**

*(do — click **Next**)*

---

## Screen 5 · One company in detail

**The one point:** onboarding a company is configuration, not a project.

> **“This is one company in detail. Its ERP, how it connects, and what it provided.”**

> **“Everything on this page is settings. No code was written for this company.”**

*(do — click **Next**)*

---

# Act III — Bringing a company on

## Screen 6 · Connecting a new company

**The one point:** three ways to connect, so no company is blocked.

> **“This is how a new company is added. The first choice is how to connect it.”**

Say the three methods slowly. One line each:

> **“Method one. Direct connection, for a modern ERP with an interface.”**
> **“Method two. A small agent installed on their side, for an older on-premise system
> behind a firewall.”**
> **“Method three. Secure file transfer, for a system with no interface at all.”**

> **“The method is chosen for each company after we look at its ERP. We do not assume.”**

*(do — run the connection test on screen)*

> **“And the connection is tested before the company goes live.”**

*(do — click **Next**)*

---

## Screen 7 · Mapping Studio

**The one point:** the hardest technical work is done by an analyst, not a developer.

> **“Every ERP calls its fields something different. The tax rules require one exact
> format. This screen is where the two are joined.”**

> **“On the left, their field. On the right, the standard field. In the middle, any
> conversion needed — a date format, a code, a decimal.”**

> **“An analyst does this by choosing from lists. No code is written.”**

*(do — click the **Derived** tab)*

> **“And these are the values we produce ourselves. The company does not have to supply
> them. That reduces the work on their side.”**

*(do — scroll to the live preview)*

> **“And here you can see the result immediately. Their data on the left. The official
> document on the right.”**

*(do — click **Next**)*

---

# Act IV — One invoice, end to end

## Screen 8 · Processing Queue

**The one point:** you always know where every document is.

> **“Every document being processed right now, and the stage it has reached.”**

> **“There are nine stages. I want to point out two of them.”**

*(point at stage 5)*

> **“Stage five is Record. The document is stored **before** it is sent. So if the
> network fails, there is still proof of what we tried to send.”**

*(point at stage 9)*

> **“Stage nine is Archive. That is the long-term legal record. It comes last, because
> it contains the confirmations, and those arrive at the end.”**

*(point at the per-company lanes)*

> **“And each company has its own lane. One company’s problem never delays another.”**

*(do — click **Next**)*

---

## Screen 9 · Document Inspector

**The one point:** the document is proven correct before it leaves.

> **“This is the actual official document, and the check that was run on it.”**

> **“It is validated against the official Oman rule set before transmission. If it
> fails, it never goes to the network. It is stopped here.”**

*(do — click **Next**)*

---

## Screen 10 · Inbound Documents

**The one point:** nothing is ever posted into their accounts automatically.

> **“So far we followed an invoice going out. Supplier invoices also arrive.”**

> **“The document arrives, we identify which of the four companies it belongs to,
> we validate it, and we archive the original.”**

> **“Then it is delivered into that company’s ERP as a **draft**.”**

*(pause)*

> **“It is never posted automatically. A person reviews it and approves it. We remove
> the typing, not the control.”**

*(do — click **Next**)*

---

## Screen 11 · Processing History

**The one point:** every document can be found and proven, later.

> **“Everything that has been processed, in both directions, searchable.”**

> **“For any document you can see what is held in the archive — the document itself, the
> validation result, the confirmations, and the full timeline.”**

> **“This is what you would show an auditor.”**

*(do — click **Next**)*

---

## Screen 12 · Reports

**The one point:** the data supports the VAT return and the exceptions review.

> **“VAT summaries. Reporting completeness. How long exceptions have been open.”**

> **“The point of this screen is that the compliance data is in one place, for all
> all four companies, and it can be exported.”**

*(do — click **Next**)*

---

# Act VI — What each company gets

## Screen 13 · Users & Access

**The one point:** the central team never holds a company’s password.

> **“Each company administers its own users.”**

> **“The central team sends one invitation. The person sets their own password and their
> own second factor. After that, the company adds and removes its own people.”**

> **“The central team can configure the platform. It cannot post anything into any ERP.”**

*(do — click **Next**)*

---

## Screen 14 · A company signs in

> **“Now I will stop being the group team. I will sign in as one company.”**

*(do — click **Sign in**)*

---

## Screen 15 · What that company sees

**The one point:** strict separation. This is usually the moment that convinces people.

> **“This is Al Nasr Marbles’ own portal.”**

*(pause)*

> **“They see their own invoices. Their own supplier invoices. Their own exceptions.
> Their own users.”**

> **“They cannot see the other eighty-eight companies. Not the volumes, not the names,
> not the failures. Each company sees only itself.”**

*(do — click **Next**)*

---

## Screen 16 · Back on the invoice — **the scope boundary**

**This is the most important screen commercially. Do not rush it. Read the red box
before you say anything else.**

> **“This is the last screen. It is the same invoice we started with, in the same ERP.”**

*(do — point at the red box, and pause)*

> **“Before I describe it, please read this red note.”**

*(pause — five seconds)*

> **“The invoice now shows the reference, the status and the QR code. But I have to be
> very clear about who builds that part.”**

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

> **“That is the walkthrough. One invoice, from their ERP, to the tax authority, and
> back again.”**

> **“Three things I would like you to remember.”**

> **“One. Your people keep working in their own system.”**
> **“Two. The compliance work is solved once, centrally, for all four companies —
> not four times.”**
> **“Three. Each company sees only its own data.”**

> **“Please remember this was a prototype with invented numbers. What is real is the
> design. Thank you. What questions do you have?”**

---

# Questions you should expect

Keep the answers short. A short answer sounds certain.

**“Is this already built?”**
> **“No. This is a prototype of the design. It shows what we are proposing to build.”**

**“Is the data real?”**
> **“The company names are real. Every number is invented for the demonstration.”**

**“Do our companies have to change their ERP?”**
> **“No. We connect to what is already there. That is why there are three connection
> methods.”**

**“What if a company’s ERP has no interface?”**
> **“That is method three — secure file transfer. It is designed for exactly that case.”**

**“What happens if the network or the provider is down?”**
> **“The document is already stored before we send it. It is retried automatically. And
> nothing is lost, because we archive before transmission, not after.”**

**“Can the central team see or change our accounting data?”**
> **“The central team can configure the platform. It cannot post anything into any ERP.
> Posting stays with your own finance users.”**

**“Can one company see another company’s data?”**
> **“No. I showed you that on the portal screen. Each company sees only itself.”**

**“Who builds the ERP side?”**
> **“Your ERP team or your ERP vendor. If you want us to do it, we will quote it as a
> separate piece of work.”**

**“How long does it take to add one company?”**
> **“That depends on the ERP and on the data. What I can say is what you saw — it is
> configuration, not a new installation for each company.”**

**A question you cannot answer.** Do not guess. Say:
> **“That is a good question. I do not want to give you a wrong answer. Let me confirm
> it and come back to you in writing.”**

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

1. **Group Dashboard** — “Four companies, one screen. And it tells you when a
   company goes silent.”
2. **Mapping Studio** — “Every ERP is different. This is where they are joined to the
   standard, by an analyst, without code.”
3. **Company portal** — “Each company sees only its own data.”
4. **The last ERP screen** — read the red scope box.

That is the whole argument.
