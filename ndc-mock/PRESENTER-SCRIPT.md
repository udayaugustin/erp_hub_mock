# Presenter script — National Detergent Co E-Invoicing walkthrough

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

> **“The company name is real, so you recognise your own operations. Every number is
> invented. Please do not read the figures as real figures.”**

> **“The purpose is simple. Instead of reading the design in a document, you can see it.”**

*(do — click **I understand**)*

> **“The walkthrough has fifteen screens, in six short parts. I will follow one
> invoice. It leaves your ERP, becomes a compliant e-invoice, is sent and
> reported, and comes back with its answer. Please stop me at any point.”**

*(do — click **Start the walkthrough**)*

---

# Act I — It starts in your systems

## Screen 1 · Customer Invoices *(Dynamics 365)*

**The one point:** your people keep working exactly as they do today.

> **“This is National Detergent Co’s own Dynamics 365, and this is their customer invoice
> list. Nothing on this screen changes.”**

> **“The user creates the invoice as normal. They post it as normal. They do not log in
> anywhere else, and they do not learn a new system.”**

*(point at the status column on the right)*

> **“Only one thing is added — this status column. It tells them what happened to the
> invoice after it was posted. That is the whole change for the finance user.”**

*(do — click **Next**)*

---

## Screen 2 · Van Sales *(FieldAssist)*

**The one point:** invoices are born in two places, but they leave through one.

> **“Not every invoice starts in Dynamics. Your van reps sell Bahar and the rest off the
> vans, to retailers, all day. Those sales are captured in FieldAssist.”**

*(pause)*

> **“FieldAssist syncs those van sales into Dynamics on a schedule. So the high-volume
> simplified receipts join the same stream as everything else.”**

> **“Nothing is installed on the vans. The compliance system only ever reads Dynamics.
> Two origins, one pipe to the tax authority.”**

*(point at the assumption note)*

> **“One thing we must confirm with you. We are assuming these simplified van invoices are
> reported to the tax authority in batch, from Dynamics — not cleared live at the point of
> sale. Please read this note. We will confirm it with you and against the OTA rules.”**

*(do — click **Next**)*

---

## Screen 3 · Signing in to the compliance system

**The one point:** two views of the same system — the compliance console and a lighter
finance portal.

> **“This is the compliance console. Your compliance team signs in here.”**

> **“Notice the line under the title. The compliance team signs in here. Finance users
> sign in to a lighter portal, which I will show you at the end.”**

> **“Nobody shares a login. Every user gets their own.”**

*(do — click **Sign in**)*

---

# Act II — Your compliance dashboard

## Screen 4 · Dashboard

**The one point:** one screen answers “is the company compliant today?”

> **“This is your compliance view — every invoice for the company on one screen.”**

*(pause — let them look)*

> **“Today’s volume. Today’s failures. What is still in progress.”**

*(point at the alert about reporting that has gone quiet)*

> **“This line is the important one. There are stretches today when the system expected
> documents from the ERP and received none. Nothing has failed — nothing arrived, and
> silence is easy to miss. The system watches for it and tells you.”**

> **“Without this, somebody has to remember to check the connection every morning. Nobody
> does that every day.”**

*(do — click **Next**)*

---

# Act III — Setup, not installation

## Screen 5 · Connecting the ERP

**The one point:** three ways to connect, so the ERP is never blocked.

> **“This is how the ERP is connected. The first choice is how to connect it.”**

Say the three methods slowly. One line each:

> **“Method one. Direct connection, for a modern ERP with an interface.”**
> **“Method two. A small agent installed on your side, for an older on-premise system
> behind a firewall.”**
> **“Method three. Secure file transfer, for a system with no interface at all.”**

> **“The method is chosen after we look at the ERP. We do not assume.”**

*(do — run the connection test on screen)*

> **“And the connection is tested before go-live.”**

*(do — click **Next**)*

---

## Screen 6 · Mapping Studio

**The one point:** the hardest technical work is done by an analyst, not a developer.

> **“Every ERP calls its fields something different. The tax rules require one exact
> format. This screen is where the two are joined.”**

> **“On the left, their field. On the right, the standard field. In the middle, any
> conversion needed — a date format, a code, a decimal.”**

> **“An analyst does this by choosing from lists. No code is written.”**

*(do — click the **Derived** tab)*

> **“And these are the values we produce ourselves. You do not have to supply
> them. That reduces the work on your side.”**

*(do — scroll to the live preview)*

> **“And here you can see the result immediately. Your data on the left. The official
> document on the right.”**

*(do — click **Next**)*

---

# Act IV — One invoice, end to end

## Screen 7 · Processing Queue

**The one point:** you always know where every document is.

> **“Every document being processed right now, and the stage it has reached.”**

> **“There are nine stages. I want to point out two of them.”**

*(point at stage 5)*

> **“Stage five is Record. The document is stored **before** it is sent. So if the
> network fails, there is still proof of what we tried to send.”**

*(point at stage 9)*

> **“Stage nine is Archive. That is the long-term legal record. It comes last, because
> it contains the confirmations, and those arrive at the end.”**

*(point at the lanes)*

> **“And the queue is split into lanes by document type. A hold-up in one lane never
> delays the others.”**

*(do — click **Next**)*

---

## Screen 8 · Document Inspector

**The one point:** the document is proven correct before it leaves.

> **“This is the actual official document, and the check that was run on it.”**

> **“It is validated against the official Oman rule set before transmission. If it
> fails, it never goes to the network. It is stopped here.”**

*(do — click **Next**)*

---

# Act V — The other direction, and the record

## Screen 9 · Inbound Documents

**The one point:** nothing is ever posted into your accounts automatically.

> **“So far we followed an invoice going out. Supplier invoices also arrive.”**

> **“The document arrives, we confirm it is addressed to National Detergent Co,
> we validate it, and we archive the original.”**

> **“Then it is delivered into the ERP as a **draft**.”**

*(pause)*

> **“It is never posted automatically. A person reviews it and approves it. We remove
> the typing, not the control.”**

*(do — click **Next**)*

---

## Screen 10 · Processing History

**The one point:** every document can be found and proven, later.

> **“Everything that has been processed, in both directions, searchable.”**

> **“For any document you can see what is held in the archive — the document itself, the
> validation result, the confirmations, and the full timeline.”**

> **“This is what you would show an auditor.”**

*(do — click **Next**)*

---

## Screen 11 · Reports

**The one point:** the data supports the VAT return and the exceptions review.

> **“VAT summaries. Reporting completeness. How long exceptions have been open.”**

> **“The point of this screen is that the compliance data is in one place for the
> company, and it can be exported.”**

*(do — click **Next**)*

---

# Act VI — Logins and the finance view

## Screen 12 · Users & Access

**The one point:** the administrator issues logins but never holds a user’s password.

> **“Your administrator manages your own users.”**

> **“The administrator sends one invitation. The person sets their own password and their
> own second factor. After that, the administrator adds and removes people as needed.”**

> **“The administrator can configure the system. It cannot post anything into the ERP.”**

*(do — click **Next**)*

---

## Screen 13 · A finance user signs in

> **“Now I will sign in as a finance user, in the finance portal.”**

*(do — click **Sign in**)*

---

## Screen 14 · The finance view

**The one point:** a lighter view of the same system for finance users.

> **“This is the finance portal for National Detergent Co.”**

*(pause)*

> **“Finance users see the invoices, the supplier invoices, the exceptions and the
> reports — a lighter view than the compliance console.”**

> **“This portal holds only National Detergent Co’s data. It runs on the company’s own
> systems, and there is no other company’s data in it.”**

*(do — click **Next**)*

---

## Screen 15 · Back on the invoice — **the scope boundary**

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
> transmission, the reporting, the archive, the dashboard — is delivered by us.”**

---

## Closing

> **“That is the walkthrough. One invoice, from the ERP, to the tax authority, and
> back again.”**

> **“Three things I would like you to remember.”**

> **“One. Your people keep working in their own systems — Dynamics, and the vans.”**
> **“Two. The compliance work is solved once, inside the company’s own systems — no
> bolt-on, and no separate platform.”**
> **“Three. Your data stays in your own systems — nothing is pooled anywhere else.”**

> **“Please remember this was a prototype with invented numbers. What is real is the
> design. Thank you. What questions do you have?”**

---

# Questions you should expect

Keep the answers short. A short answer sounds certain.

**“Is this already built?”**
> **“No. This is a prototype of the design. It shows what we are proposing to build.”**

**“Is the data real?”**
> **“The company name is real. Every number is invented for the demonstration.”**

**“Do we have to change our ERP?”**
> **“No. We connect to what is already there. That is why there are three connection
> methods.”**

**“How do the van sales fit in?”**
> **“Your van sales already flow from FieldAssist into Dynamics. We read them there,
> along with everything else. We do not touch the vans.”**

**“Are the van receipts cleared live, at the point of sale?”**
> **“That is the one thing we need to confirm. We are assuming they are reported in batch
> from Dynamics, not cleared live. We will confirm it with you and against the OTA rules.”**

**“What if our ERP has no interface?”**
> **“That is method three — secure file transfer. It is designed for exactly that case.”**

**“What happens if the network or the provider is down?”**
> **“The document is already stored before we send it. It is retried automatically. And
> nothing is lost, because we archive before transmission, not after.”**

**“Can the system change our accounting data?”**
> **“It runs on your own systems and configures compliance. It does not post into your
> ledgers. Posting stays with your finance users.”**

**“Where does our data live?”**
> **“On your own systems. It runs on your own servers, and nothing is pooled anywhere
> else.”**

**“Who builds the ERP side?”**
> **“Your ERP team or your ERP vendor. If you want us to do it, we will quote it as a
> separate piece of work.”**

**“How long does it take to set up?”**
> **“That depends on the ERP and on the data. What I can say is what you saw — it is
> configuration, not a new installation.”**

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

1. **Dashboard** — “The company’s compliance status on one screen. And it tells you
   when reporting goes silent.”
2. **Mapping Studio** — “Every ERP is different. This is where they are joined to the
   standard, by an analyst, without code.”
3. **Finance view** — “A lighter portal for finance users, on the company’s own systems.”
4. **The last ERP screen** — read the red scope box.

That is the whole argument.
