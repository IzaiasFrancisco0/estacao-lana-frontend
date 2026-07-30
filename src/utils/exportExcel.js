import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export function exportHistoryToExcel(movements) {
  if (!movements.length) {
    alert("Não há movimentações para exportar.");
    return;
  }

  const companyName = "ESTAÇÃO LANA";

  const now = new Date();

  const date = now.toLocaleDateString("pt-BR");
  const time = now.toLocaleTimeString("pt-BR");


  const rows = [
    [companyName],
    ["Relatório de Movimentações de Estoque"],
    [],

    ["Data de emissão:", date],
    ["Horário de emissão:", time],
    ["Sistema:", "Controle de Estoque"],

    [],

    [
      "Data",
      "Hora",
      "Tipo",
      "Produto",
      "Quantidade",
      "Unidade",
      "Responsável",
      "Motivo",
    ],
  ];

  movements.forEach((movement) => {
    rows.push([
      movement.date,
      movement.hour,
      movement.type,
      movement.product,
      movement.quantity,
      movement.unit,
      movement.clientSupplier,
      movement.reason,
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  movements.forEach((movement, index) => {

    const row = index + 8;

    const color =
      movement.type === "Entrada"
        ? "DCFCE7"
        : "FEE2E2";


    for (let col = 0; col <= 7; col++) {

      const cell = XLSX.utils.encode_cell({
        r: row,
        c: col
      });


      worksheet[cell].s = {

        fill: {
          fgColor: {
            rgb: color
          }
        },

        border: {
          top: {
            style: "thin",
            color: {
              rgb: "D1D5DB"
            }
          },
          bottom: {
            style: "thin",
            color: {
              rgb: "D1D5DB"
            }
          }
        }

      };

    }

  });

  worksheet["A1"].s = {
    font: {
      bold: true,
      sz: 16,
      color: { rgb: "FFFFFF" }
    },
    fill: {
      fgColor: { rgb: "166534" }
    },
    alignment: {
      horizontal: "center"
    }
  };

  worksheet["A2"].s = {
    font: {
      bold: true,
      sz: 13
    },
    alignment: {
      horizontal: "center"
    }
  };

  const headerRow = 8;

  for (let col = 0; col <= 7; col++) {

    const cell = XLSX.utils.encode_cell({
      r: headerRow - 1,
      c: col
    });


    worksheet[cell].s = {
      font: {
        bold: true,
        color: {
          rgb: "FFFFFF"
        }
      },

      fill: {
        fgColor: {
          rgb: "15803D"
        }
      },

      alignment: {
        horizontal: "center"
      }
    };
  }

  worksheet["!cols"] = [
    { wch: 15 }, // Data
    { wch: 10 }, // Hora
    { wch: 15 }, // Tipo
    { wch: 25 }, // Produto
    { wch: 12 }, // Quantidade
    { wch: 12 }, // Unidade
    { wch: 25 }, // Responsável
    { wch: 30 }, // Motivo
  ];

  worksheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 7 },
    },
    {
      s: { r: 1, c: 0 },
      e: { r: 1, c: 7 },
    },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Histórico"
  );


  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    }
  );

  saveAs(
    file,
    `Relatorio_Estoque_Estacao_Lana_${date}.xlsx`
  );
}