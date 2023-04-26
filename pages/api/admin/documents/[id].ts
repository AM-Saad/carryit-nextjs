import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { refineResponse } from '@/shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';

export let config = {
    api: {
        bodyParser: false,
    },
};

export default async function uploadImages(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }


    const { tag, type, imageId } = req.query;
    const itemId = req.query.id as string;
    let item: any;

    if (tag === 'drivers') {
        item = await prisma.driver.findFirst({
            where: { id: itemId },
        });

    } else if (tag === 'vehicles') {
        item = await prisma.vehicle.findFirst({ where: { id: req.query.id as string } });
    }

    if (!item) {
        return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Item not found'));
    }



    if (type === 'upload') {

        try {



            const form = new formidable.IncomingForm({ multiples: true,  });
            form.parse(req, async (err, fields, files: any) => {
                
                if (err) {
                    console.log(err)
                    return res.status(500).json({ error: 'Error uploading images' });
                }

                const images: any[] = [];
                if (files && files.images) {
                    const filesArray = Object.values(files.images.length ? files.images : [files.images]);
                    filesArray.forEach(file => {
                        images.push(file);
                    });
                }
                const savePaths = await Promise.all(
                    images.map(async (image: any) => {
                        const fileName = `${Date.now()}-${image.name}`;
                        try {
                            const fileContents: any = await readFileAsBuffer(image);
                            if (!fileContents) {
                                throw 500 
                            }
                            const savePath = path.join(process.cwd(), 'public', 'documents', fileName);
                            await fs.promises.writeFile(savePath, fileContents);
                            return {
                                name: image.originalFilename,
                                path: `/documents/${fileName}`,
                                type: image.mimetype || 'image/jpeg',
                            };
                        } catch (e: any) {
                            console.log(e);
                            throw new Error('Error uploading images');
                        }
                    })
                );

                const newDocuments = [...item.documents, ...savePaths];

                let vehicle: any;

                if (tag === 'drivers') {
                    vehicle = await prisma.driver.update({
                        where: { id: itemId },
                        data: { documents: newDocuments },
                    });
                } else if (tag === 'vehicles') {
                    vehicle = await prisma.vehicle.update({
                        where: { id: itemId },
                        data: { documents: newDocuments },
                    });
                }

                return res.status(200).json(refineResponse(Status.SUCCESS, 'Images uploaded successfully', vehicle));
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, 'Error uploading images'));
        }
    }


    if (type === 'delete') {
        // Delete the image files from the file system
        await Promise.all(
            item.documents.map(async (doc: any) => {
                if (doc.path === imageId) {
                    const filePath = path.join(process.cwd(), 'public', 'documents', doc.path.replace('/documents/', ''));
                    await fs.promises.unlink(filePath);
                }
            })
        );
        // Remove the deleted image paths from the item's documents array
        const newDocuments = item.documents.filter((doc: any) => doc.path !== imageId);
        if (tag === 'drivers') {
           await prisma.driver.update({
                where: { id: itemId },
                data: { documents: newDocuments },
            });
        } else if (tag === 'vehicles') {
           await prisma.vehicle.update({
                where: { id: itemId },
                data: { documents: newDocuments },
            });
        }
        const vehicle = await prisma.vehicle.findFirst({ where: { id: itemId } });
        return res.status(200).json(refineResponse(Status.SUCCESS, 'Image deleted successfully', vehicle));
    }

}

async function readFileAsBuffer(file: any) {
    console.log('file', file)
    return new Promise((resolve, reject) => {
        if (!file.filepath) {
            reject(new Error('File path is undefined'));
        }
        const stream = fs.createReadStream(file.filepath);
        const chunks: any[] = [];

        stream.on('error', reject);

        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        stream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
        });
    });
}