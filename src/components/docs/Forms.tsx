"use client";

import { Box, Region, Sheet } from "./Facsimile";

type P = { hit?: string | null; page?: number; docId: string };

const W2_DATA: Record<string, { employer: string; ein: string; box1: string; box2: string; box3: string; box4: string; box5: string; state: string; box16: string; box17: string }> = {
  "d-w2-northwind": {
    employer: "Northwind Robotics Inc.\n4400 Perimeter Way\nSeattle, WA 98108",
    ein: "91-2044817",
    box1: "168,400.00",
    box2: "26,140.00",
    box3: "176,100.00",
    box4: "10,918.20",
    box5: "176,100.00",
    state: "WA",
    box16: "0.00",
    box17: "0.00",
  },
  "d-w2-cascade": {
    employer: "Cascade Analytics LLC\n210 Third Ave S, Suite 640\nPortland, OR 97204",
    ein: "93-1188420",
    box1: "41,225.00",
    box2: "5,800.00",
    box3: "41,225.00",
    box4: "2,555.95",
    box5: "41,225.00",
    state: "OR",
    box16: "41,225.00",
    box17: "3,462.00",
  },
};

export function W2Doc({ hit, docId }: P) {
  const d = W2_DATA[docId] ?? W2_DATA["d-w2-northwind"];
  return (
    <Sheet label="Form W-2 · Wage and Tax Statement · 2025">
      <div className="grid grid-cols-4 gap-px bg-ink/10 [&>*]:bg-white">
        <div className="col-span-2 border border-ink/25 px-1.5 py-1">
          <div className="text-[8.5px] uppercase text-ink-2">
            <span className="font-semibold">c</span> Employer name, address, ZIP
          </div>
          <div className="mt-0.5 whitespace-pre-line text-[10.5px] leading-tight">
            {d.employer}
          </div>
        </div>
        <Box n="b" title="Employer EIN">
          {d.ein}
        </Box>
        <Box n="a" title="Employee SSN">
          ***-**-4471
        </Box>

        <Box n="1" title="Wages, tips, other compensation">
          <Region id="box1" hit={hit} className="px-0.5">
            {d.box1}
          </Region>
        </Box>
        <Box n="2" title="Federal income tax withheld">
          <Region id="box2" hit={hit} className="px-0.5">
            {d.box2}
          </Region>
        </Box>
        <Box n="3" title="Social security wages">
          <Region id="box3" hit={hit} className="px-0.5">
            {d.box3}
          </Region>
        </Box>
        <Box n="4" title="Social security tax withheld">
          {d.box4}
        </Box>

        <Box n="5" title="Medicare wages and tips">
          {d.box5}
        </Box>
        <Box n="6" title="Medicare tax withheld">
          {(Number(d.box5.replace(/,/g, "")) * 0.0145).toFixed(2)}
        </Box>
        <Box n="12a" title="Codes">
          D 19,500.00
        </Box>
        <Box n="13" title="Checkboxes">
          Retirement plan ☑
        </Box>

        <div className="col-span-2 border border-ink/25 px-1.5 py-1">
          <div className="text-[8.5px] uppercase text-ink-2">
            <span className="font-semibold">e</span> Employee name and address
          </div>
          <div className="mt-0.5 whitespace-pre-line text-[10.5px] leading-tight">
            {"Ray Okonkwo\n1187 Larkspur Lane\nBellevue, WA 98004"}
          </div>
        </div>
        <Box n="15" title="State / Employer state ID">
          {d.state} · 601-4429-2
        </Box>
        <Box n="16" title="State wages">
          {d.box16}
        </Box>

        <Box n="17" title="State income tax">
          {d.box17}
        </Box>
        <Box n="18" title="Local wages">
          0.00
        </Box>
        <Box n="19" title="Local income tax">
          0.00
        </Box>
        <Box n="20" title="Locality name">
          —
        </Box>
      </div>
      <p className="mt-3 text-[9px] text-ink-3">
        Copy B — To be filed with employee&rsquo;s federal tax return.
      </p>
    </Sheet>
  );
}

export function Form1099IntDoc({ hit }: P) {
  return (
    <Sheet label="Form 1099-INT · Interest Income · 2025">
      <div className="mb-2 border border-ink/25 px-2 py-1.5">
        <div className="text-[8.5px] uppercase text-ink-2">Payer name, address, TIN</div>
        <div className="mt-0.5 whitespace-pre-line text-[10.5px] leading-tight">
          {"Harbor Bank, N.A.\n900 Waterfront Blvd\nSeattle, WA 98121\nTIN 91-0533740"}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-ink/10 [&>*]:bg-white">
        <Box n="1" title="Interest income">
          <Region id="box1" hit={hit} className="px-0.5">
            1,284.00
          </Region>
        </Box>
        <Box n="2" title="Early withdrawal penalty">
          <Region id="box2" hit={hit} className="px-0.5">
            65.00
          </Region>
        </Box>
        <Box n="3" title="Interest on US savings bonds">
          0.00
        </Box>
        <Box n="4" title="Federal income tax withheld">
          0.00
        </Box>
        <Box n="8" title="Tax-exempt interest">
          0.00
        </Box>
        <Box n="13" title="Bond premium on tax-exempt bond">
          0.00
        </Box>
      </div>
      <p className="mt-3 text-[9px] text-ink-3">
        Recipient: Ray Okonkwo · Account ending 8812
      </p>
    </Sheet>
  );
}

const LOTS_P1 = [
  ["ARLO", "Arlowave Systems", "03/14/2025", "22,410.00", "19,880.00"],
  ["BKST", "Brookstone Energy", "05/02/2025", "41,900.00", "38,215.00"],
  ["CDLX", "Cadence Labs", "06/21/2025", "18,650.00", "15,400.00"],
  ["DRVN", "Driven Materials", "08/09/2025", "31,208.00", "29,447.00"],
  ["EVRT", "Everett Holdings", "09/30/2025", "27,540.00", "24,110.00"],
  ["FRWD", "Forward Rail Co.", "11/12/2025", "52,600.00", "54,350.00"],
];

const LOTS_P3 = [
  ["ESPP-2016-A", "01/29/2025", "3,940.00"],
  ["ESPP-2016-B", "01/29/2025", "3,940.00"],
  ["ESPP-2016-C", "02/14/2025", "2,105.00"],
  ["ESPP-2017-A", "02/14/2025", "1,860.00"],
  ["ESPP-2017-B", "04/03/2025", "1,455.00"],
  ["LEGACY-11", "04/03/2025", "980.00"],
];

export function Form1099BDoc({ hit, page = 1 }: P) {
  if (page === 2) {
    return (
      <Sheet label="Form 1099-B · Vantage Brokerage · page 2 of 3">
        <p className="mb-2 text-[10px] font-semibold uppercase text-ink-2">
          Summary of covered lots (basis reported to the IRS)
        </p>
        <table className="w-full text-[10.5px]">
          <tbody>
            <tr className="border-b border-ink/15">
              <td className="py-1">Total proceeds, covered lots</td>
              <td className="py-1 text-right tnum">214,308.00</td>
            </tr>
            <tr className="border-b border-ink/15">
              <td className="py-1 font-semibold">Total cost basis reported to the IRS</td>
              <td className="py-1 text-right tnum font-semibold">
                <Region id="basis-covered" hit={hit} className="px-1">
                  181,402.00
                </Region>
              </td>
            </tr>
            <tr className="border-b border-ink/15">
              <td className="py-1">Wash sale loss disallowed</td>
              <td className="py-1 text-right tnum">0.00</td>
            </tr>
            <tr>
              <td className="py-1">Federal income tax withheld</td>
              <td className="py-1 text-right tnum">0.00</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4 text-[9px] text-ink-3">
          Basis figures above were furnished to the IRS. Noncovered lots appear on page 3.
        </p>
      </Sheet>
    );
  }

  if (page === 3) {
    return (
      <Sheet label="Form 1099-B · Vantage Brokerage · page 3 of 3">
        <p className="mb-1 text-[10px] font-semibold uppercase text-ink-2">
          Noncovered lots — basis not reported to the IRS
        </p>
        <Region id="noncovered-block" hit={hit} className="block px-1 py-1">
          <table className="w-full text-[10.5px]">
            <thead>
              <tr className="border-b border-ink/30 text-[9px] uppercase text-ink-2">
                <th className="py-1 text-left">Lot</th>
                <th className="py-1 text-left">Date sold</th>
                <th className="py-1 text-right">Proceeds</th>
                <th className="py-1 text-right">Cost basis</th>
              </tr>
            </thead>
            <tbody>
              {LOTS_P3.map(([lot, date, proceeds]) => (
                <tr key={lot} className="border-b border-ink/10">
                  <td className="py-1">{lot}</td>
                  <td className="py-1">{date}</td>
                  <td className="py-1 text-right tnum">{proceeds}</td>
                  <td className="py-1 text-right text-ink-3">not reported</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} className="py-1 text-[9.5px] italic text-ink-3">
                  … 8 further lots, all basis not reported
                </td>
              </tr>
            </tbody>
          </table>
        </Region>
        <p className="mt-3 text-[9px] text-ink-3">
          14 lots total. Vantage does not hold acquisition records for securities transferred in
          before 2012.
        </p>
      </Sheet>
    );
  }

  return (
    <Sheet label="Form 1099-B · Vantage Brokerage · page 1 of 3">
      <div className="mb-2 border border-ink/25 px-2 py-1.5">
        <div className="text-[8.5px] uppercase text-ink-2">Payer</div>
        <div className="mt-0.5 whitespace-pre-line text-[10.5px] leading-tight">
          {"Vantage Brokerage Services\n77 Battery Street\nSan Francisco, CA 94111\nTIN 94-3188205"}
        </div>
      </div>
      <table className="w-full text-[10.5px]">
        <thead>
          <tr className="border-b border-ink/30 text-[9px] uppercase text-ink-2">
            <th className="py-1 text-left">Sym</th>
            <th className="py-1 text-left">Description</th>
            <th className="py-1 text-left">Date sold</th>
            <th className="py-1 text-right">Proceeds</th>
            <th className="py-1 text-right">Basis</th>
          </tr>
        </thead>
        <tbody>
          {LOTS_P1.map(([sym, name, date, proceeds, basis]) => (
            <tr key={sym} className="border-b border-ink/10">
              <td className="py-1 font-semibold">{sym}</td>
              <td className="py-1">{name}</td>
              <td className="py-1">{date}</td>
              <td className="py-1 text-right tnum">{proceeds}</td>
              <td className="py-1 text-right tnum">{basis}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} className="py-1 text-[9.5px] italic text-ink-3">
              … 31 further covered lots
            </td>
          </tr>
          <tr className="border-t border-ink/30">
            <td colSpan={3} className="py-1.5 font-semibold">
              Box 1d — Total proceeds, all lots
            </td>
            <td className="py-1.5 text-right font-semibold tnum">
              <Region id="proceeds-total" hit={hit} className="px-1">
                214,308.00
              </Region>
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </Sheet>
  );
}

export function K1Doc({ hit }: P) {
  return (
    <Sheet label="Schedule K-1 (Form 1120-S) · 2025">
      <div className="mb-2 grid grid-cols-2 gap-px bg-ink/10 [&>*]:bg-white">
        <div className="border border-ink/25 px-1.5 py-1">
          <div className="text-[8.5px] uppercase text-ink-2">Part I — Corporation</div>
          <div className="mt-0.5 whitespace-pre-line text-[10.5px] leading-tight">
            {"Alvarez Design Co.\n55 Foundry Row\nTacoma, WA 98402\nEIN 91-2287604"}
          </div>
        </div>
        <div className="border border-ink/25 px-1.5 py-1">
          <div className="text-[8.5px] uppercase text-ink-2">Part II — Shareholder</div>
          <div className="mt-0.5 whitespace-pre-line text-[10.5px] leading-tight">
            {"Ray Okonkwo\n1187 Larkspur Lane\nBellevue, WA 98004\nStock ownership 40%"}
          </div>
        </div>
      </div>

      <p className="mb-1 text-[9px] uppercase text-ink-2">
        Part III — Shareholder&rsquo;s share of current year income
      </p>
      <div className="grid grid-cols-2 gap-px bg-ink/10 [&>*]:bg-white">
        <Box n="1" title="Ordinary business income (loss)">
          <Region id="box1" hit={hit} className="px-0.5">
            62,400.00
          </Region>
        </Box>
        <Box n="2" title="Net rental real estate income">
          0.00
        </Box>
        <Box n="4" title="Interest income">
          312.00
        </Box>
        <Box n="5a" title="Ordinary dividends">
          0.00
        </Box>
        <Box n="12" title="Deductions — code A">
          1,800.00
        </Box>
        <Box n="16" title="Distributions — code D">
          18,000.00
        </Box>
      </div>
      <p className="mt-3 text-[9px] text-ink-3">
        Final K-1 ☐ · Amended K-1 ☐ · Issued 03/05/2026
      </p>
    </Sheet>
  );
}

export function Form1098Doc({ hit }: P) {
  return (
    <Sheet label="Form 1098 · Mortgage Interest Statement · 2025">
      <div className="mb-2 border border-ink/25 px-2 py-1.5">
        <div className="text-[8.5px] uppercase text-ink-2">Recipient / Lender</div>
        <div className="mt-0.5 whitespace-pre-line text-[10.5px] leading-tight">
          {"Summit Mortgage Servicing\n1400 Alder Street\nBoise, ID 83702\nTIN 82-0447115"}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-ink/10 [&>*]:bg-white">
        <Box n="1" title="Mortgage interest received from payer">
          <Region id="box1" hit={hit} className="px-0.5">
            14,268.00
          </Region>
        </Box>
        <Box n="2" title="Outstanding mortgage principal">
          412,900.00
        </Box>
        <Box n="3" title="Mortgage origination date">
          06/18/2021
        </Box>
        <Box n="5" title="Mortgage insurance premiums">
          0.00
        </Box>
        <Box n="6" title="Points paid on purchase">
          0.00
        </Box>
        <Box n="10" title="Real property taxes">
          6,240.00
        </Box>
      </div>
      <p className="mt-3 text-[9px] text-ink-3">
        Payer: Ray Okonkwo · Property: 1187 Larkspur Lane, Bellevue, WA 98004
      </p>
    </Sheet>
  );
}

// Not every document renders. A source that could not be read has to say so
// rather than showing a blank pane, because that failure is part of the story.
export function UnreadableDoc({ title }: { title: string }) {
  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="rounded-lg border border-dashed border-caution-line bg-caution-soft px-5 py-8 text-center">
        <p className="text-[13px] font-medium text-caution">Preview not available</p>
        <p className="mx-auto mt-1.5 max-w-sm text-[12px] leading-relaxed text-ink-2">
          {title} was scanned at an angle with the right edge cut off. Extraction still produced
          a number, but there is nothing here a person can check it against.
        </p>
      </div>
    </div>
  );
}
