import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

interface FurnitureItem {
    id: string;
    name: string;
    type: string;
    x: number;
    y: number;
    z?: number;
    width: number;
    height: number;
    depth?: number;
}

interface ExportData {
    planId: number;
    userName: string;
    vanModel: string;
    vanDimensions: { length: number; width: number; height: number };
    furniture: FurnitureItem[];
    screenshot2D: string; // base64
    screenshots3D?: { front?: string; side?: string; iso?: string };
}

@Injectable()
export class PdfService {
    constructor(private prisma: PrismaService) { }

    /**
     * Generate PDF report
     */
    async generatePdf(data: ExportData): Promise<Buffer> {
        const fonts = {
            Roboto: {
                normal: 'node_modules/pdfmake/build/vfs_fonts.js',
                bold: 'node_modules/pdfmake/build/vfs_fonts.js',
            },
        };

        const printer = new PdfPrinter(fonts);

        const docDefinition = this.createDocumentDefinition(data);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', reject);
            pdfDoc.end();
        });
    }

    private createDocumentDefinition(data: ExportData): TDocumentDefinitions {
        const now = new Date();
        const dateStr = now.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        return {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 80],

            header: {
                columns: [
                    {
                        text: '🚐 RAPPORT D\'AMÉNAGEMENT',
                        fontSize: 16,
                        bold: true,
                        margin: [40, 20, 0, 0],
                    },
                    {
                        stack: [
                            { text: data.userName, fontSize: 12, bold: true, alignment: 'right' },
                            { text: dateStr, fontSize: 10, alignment: 'right', margin: [0, 2, 0, 0] },
                        ],
                        margin: [0, 20, 40, 0],
                    },
                ],
            },

            footer: (currentPage: number, pageCount: number) => ({
                columns: [
                    {
                        text: `2DVanProj © ${new Date().getFullYear()} Eric Laidet Consulting\nwww.2dvanproj.com`,
                        fontSize: 8,
                        alignment: 'left',
                        margin: [40, 0, 0, 0],
                    },
                    {
                        text: `Page ${currentPage} / ${pageCount}\nGénéré le ${dateStr}`,
                        fontSize: 8,
                        alignment: 'right',
                        margin: [0, 0, 40, 0],
                    },
                ],
                margin: [0, 10, 0, 20],
            }),

            content: [
                // Van specs
                // Van specs
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    stack: [
                                        { text: `Véhicule: ${data.vanModel}`, fontSize: 12, bold: true },
                                        {
                                            text: `Dimensions: ${(data.vanDimensions.length / 1000).toFixed(2)}m × ${(data.vanDimensions.width / 1000).toFixed(2)}m × ${(data.vanDimensions.height / 1000).toFixed(2)}m`,
                                            fontSize: 10,
                                            margin: [0, 4, 0, 0],
                                        },
                                        {
                                            text: `Volume: ${((data.vanDimensions.length * data.vanDimensions.width * data.vanDimensions.height) / 1000000000).toFixed(2)} m³`,
                                            fontSize: 10,
                                            margin: [0, 2, 0, 0],
                                        },
                                    ],
                                    margin: [10, 10, 10, 10],
                                },
                            ],
                        ],
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 20],
                },

                // Furniture inventory
                { text: 'INVENTAIRE DES MEUBLES', fontSize: 14, bold: true, margin: [0, 10, 0, 10] },
                this.createFurnitureTable(data.furniture),

                // Spacing analysis
                { text: 'ANALYSE DÉTAILLÉE DES ESPACEMENTS', fontSize: 14, bold: true, margin: [0, 20, 0, 10] as [number, number, number, number], pageBreak: 'before' as 'before' },
                ...(this.createSpacingAnalysis(data.furniture, data.vanDimensions) as any),

                // 2D View
                { text: 'VUE 2D DU PLAN', fontSize: 14, bold: true, margin: [0, 20, 0, 10] as [number, number, number, number], pageBreak: 'before' as 'before' },
                data.screenshot2D
                    ? { image: data.screenshot2D, width: 500, alignment: 'center' as 'center' }
                    : { text: 'Image non disponible', italics: true },

                // 3D Views
                ...(data.screenshots3D
                    ? [
                        {
                            text: 'VUES 3D',
                            fontSize: 14,
                            bold: true,
                            margin: [0, 20, 0, 10] as [number, number, number, number],
                            pageBreak: 'before' as 'before',
                        },
                        {
                            columns: [
                                data.screenshots3D.front
                                    ? { image: data.screenshots3D.front, width: 170 }
                                    : {},
                                data.screenshots3D.side
                                    ? { image: data.screenshots3D.side, width: 170 }
                                    : {},
                                data.screenshots3D.iso
                                    ? { image: data.screenshots3D.iso, width: 170 }
                                    : {},
                            ],
                            columnGap: 10,
                        },
                    ]
                    : []),
            ],
        };
    }

    private createFurnitureTable(furniture: FurnitureItem[]) {
        return {
            table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto', 'auto'],
                body: [
                    [
                        { text: 'Nom', bold: true },
                        { text: 'Type', bold: true },
                        { text: 'Dimensions (cm)', bold: true },
                        { text: 'Volume (m³)', bold: true },
                    ],
                    ...furniture.map((f) => {
                        const w = f.width / 10;
                        const h = f.height / 10;
                        const d = (f.depth || f.height) / 10;
                        const volume = (w * h * d) / 1000000;

                        return [
                            f.name || 'Sans nom',
                            f.type,
                            `${w.toFixed(0)}×${h.toFixed(0)}×${d.toFixed(0)}`,
                            volume.toFixed(2),
                        ];
                    }),
                ],
            },
            layout: 'lightHorizontalLines',
        };
    }

    private createSpacingAnalysis(furniture: FurnitureItem[], vanDim: any) {
        if (furniture.length < 2) {
            return [{ text: 'Analyse non disponible (minimum 2 meubles requis)', italics: true }];
        }

        // Distance matrix
        const matrix = this.calculateDistanceMatrix(furniture);
        const wallClearances = this.calculateWallClearances(furniture, vanDim);

        return [
            { text: '1. DISTANCES ENTRE MEUBLES', fontSize: 12, bold: true, margin: [0, 0, 0, 5] },
            matrix,
            { text: '2. DÉGAGEMENTS MURAUX', fontSize: 12, bold: true, margin: [0, 15, 0, 5] },
            wallClearances,
        ];
    }

    private calculateDistanceMatrix(furniture: FurnitureItem[]) {
        const headers = ['', ...furniture.map((f) => f.name || f.type)];
        const rows = furniture.map((f1, i) => {
            const row = [f1.name || f1.type];
            furniture.forEach((f2, j) => {
                if (i === j) {
                    row.push('-');
                } else {
                    const dist = Math.sqrt(
                        Math.pow(f2.x - f1.x, 2) + Math.pow(f2.y - f1.y, 2)
                    );
                    const gap = Math.max(
                        0,
                        dist - (f1.width + f2.width) / 2 - (f1.height + f2.height) / 2
                    );
                    row.push(`${Math.round(gap / 10)} cm`);
                }
            });
            return row;
        });

        return {
            table: {
                headerRows: 1,
                widths: Array(furniture.length + 1).fill('auto'),
                body: [headers, ...rows],
            },
            layout: 'lightHorizontalLines',
            fontSize: 9,
        };
    }

    private calculateWallClearances(furniture: FurnitureItem[], vanDim: any) {
        const rows = furniture.map((f) => {
            const front = Math.round((vanDim.length - (f.x + f.width)) / 10);
            const rear = Math.round(f.x / 10);
            const left = Math.round(f.y / 10);
            const right = Math.round((vanDim.width - (f.y + f.height)) / 10);

            return [f.name || f.type, `${front} cm`, `${rear} cm`, `${left} cm`, `${right} cm`];
        });

        return {
            table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                body: [
                    ['Meuble', 'Mur Av.', 'Mur Arr.', 'Mur G.', 'Mur D.'],
                    ...rows,
                ],
            },
            layout: 'lightHorizontalLines',
            fontSize: 9,
        };
    }
}
