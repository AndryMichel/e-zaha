"use client"

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/molécules/card';
import {Input} from '@/components/ui/atomes/input';
import {Textarea} from '@/components/ui/atomes/textarea';
import {Button} from '@/components/ui/atomes/button';
import {AlertCircle, CheckCircle, Loader2, Mail, MapPin, Phone, Send} from 'lucide-react';
import {motion} from '@/components/ui/templates/motion';
import PageHeader from '@/components/ui/templates/PageHeader';
import SectionHeader from '@/components/ui/templates/SectionHeader';
import {sendMessage} from '@/services/api/message/message.api';
import {SendMessageRequest} from '@/services/types/message.type';
import {toast} from 'sonner';

// Define interface for form data
interface ContactFormData {
    nom: string;
    email: string;
    sujet: string;
    message: string;
}

export const ContactPage = () => {
    // State for form submission and form data
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ContactFormData>({
        nom: '',
        email: '',
        sujet: '',
        message: ''
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation côté client
        if (!formData.nom.trim()) {
            toast.error("Le nom est obligatoire");
            return;
        }

        if (!formData.email.trim()) {
            toast.error("L'email est obligatoire");
            return;
        }

        if (!formData.sujet.trim()) {
            toast.error("Le sujet est obligatoire");
            return;
        }

        if (!formData.message.trim()) {
            toast.error("Le message est obligatoire");
            return;
        }

        // Validation de l'email
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Format d'email invalide");
            return;
        }

        try {
            setIsSubmitting(true);

            // Préparer les données pour l'API
            const messageData: SendMessageRequest = {
                nom: formData.nom.trim(),
                email: formData.email.trim(),
                sujet: formData.sujet.trim(),
                message: formData.message.trim()
            };

            // Envoyer le message via l'API
            const result = await sendMessage(messageData);

            if (result.success) {
                setSubmitted(true);
                toast.success("Message envoyé avec succès !");

                // Reset form après 3 secondes
                setTimeout(() => {
                    setSubmitted(false);
                    setFormData({
                        nom: '',
                        email: '',
                        sujet: '',
                        message: ''
                    });
                }, 3000);
            } else {
                throw new Error(result.message || "Erreur lors de l'envoi");
            }

        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);

            if (error instanceof Error) {
                toast.error(`Erreur: ${error.message}`);
            } else {
                toast.error("Une erreur inattendue s'est produite. Veuillez réessayer.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Page Header */}
            <PageHeader
                title="Contactez-nous"
                subtitle="Nous sommes à votre écoute pour répondre à vos questions et vous accompagner"
            />

            {/* Main Contact Section */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-6">
                    <div className="grid gap-12 md:grid-cols-3">
                        {/* Contact Information Column */}
                        <div className="md:col-span-1">
                            <motion.div
                                initial={{opacity: 0, x: -30}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.8}}
                            >
                                <SectionHeader
                                    title="Nos coordonnées"
                                    alignment="left"
                                />

                                {/* Email Contact Card */}
                                <Card className="mb-6 shadow-lg">
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white">
                                            <Mail className="h-6 w-6"/>
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl mb-2">Email</CardTitle>
                                            <p className="text-gray-700">observatoireddl@gmail.com</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Phone Contact Card */}
                                <Card className="mb-6 shadow-lg">
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white">
                                            <Phone className="h-6 w-6"/>
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl mb-2">Téléphone</CardTitle>
                                            <p className="text-gray-700">038 73 630 04 / 038 12 071 64</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Address Contact Card */}
                                <Card className="shadow-lg">
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white">
                                            <MapPin className="h-6 w-6"/>
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl mb-2">Adresse</CardTitle>
                                            <p className="text-gray-700">Bâtiment MID Tsimbazaza, 1èr étage</p>
                                            <p className="text-gray-700">Ex- Fivondronana Tana 101</p>
                                            <p className="text-gray-600 text-sm mt-1">(ObservatoireDDL)</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Contact Form Column */}
                        <div className="md:col-span-2">
                            <motion.div
                                initial={{opacity: 0, x: 30}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.8}}
                            >
                                <Card className="shadow-xl">
                                    <CardHeader className="bg-gray-300 p-8">
                                        <CardTitle className="text-3xl font-bold text-gray-900">
                                            Envoyez-nous un message
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        {submitted ? (
                                            <motion.div
                                                initial={{opacity: 0, scale: 0.8}}
                                                animate={{opacity: 1, scale: 1}}
                                                className="flex flex-col items-center justify-center py-12"
                                            >
                                                <CheckCircle className="h-20 w-20 text-green-600 mb-4"/>
                                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                                    Message envoyé !
                                                </h3>
                                                <p className="text-gray-700 text-center">
                                                    Nous vous répondrons dans les meilleurs délais.
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    {/* Nom Input */}
                                                    <div>
                                                        <label
                                                            htmlFor="nom"
                                                            className="block text-gray-700 font-medium mb-2"
                                                        >
                                                            Nom complet *
                                                        </label>
                                                        <Input
                                                            id="nom"
                                                            name="nom"
                                                            value={formData.nom}
                                                            onChange={handleChange}
                                                            className="w-full"
                                                            maxLength={100}
                                                            required
                                                            disabled={isSubmitting}
                                                        />
                                                    </div>

                                                    {/* Email Input */}
                                                    <div>
                                                        <label
                                                            htmlFor="email"
                                                            className="block text-gray-700 font-medium mb-2"
                                                        >
                                                            Email *
                                                        </label>
                                                        <Input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="w-full"
                                                            maxLength={150}
                                                            required
                                                            disabled={isSubmitting}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Sujet Input */}
                                                <div>
                                                    <label
                                                        htmlFor="sujet"
                                                        className="block text-gray-700 font-medium mb-2"
                                                    >
                                                        Sujet *
                                                    </label>
                                                    <Input
                                                        id="sujet"
                                                        name="sujet"
                                                        value={formData.sujet}
                                                        onChange={handleChange}
                                                        className="w-full"
                                                        maxLength={200}
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                </div>

                                                {/* Message Textarea */}
                                                <div>
                                                    <label
                                                        htmlFor="message"
                                                        className="block text-gray-700 font-medium mb-2"
                                                    >
                                                        Message *
                                                    </label>
                                                    <Textarea
                                                        id="message"
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        rows={6}
                                                        className="w-full"
                                                        maxLength={2000}
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                    <div className="text-xs text-gray-500 mt-1 text-right">
                                                        {formData.message.length}/2000 caractères
                                                    </div>
                                                </div>

                                                {/* Submit Button */}
                                                <motion.div
                                                    whileHover={!isSubmitting ? {scale: 1.05} : {}}
                                                    whileTap={!isSubmitting ? {scale: 0.95} : {}}
                                                >
                                                    <Button
                                                        type="submit"
                                                        className="w-full py-6 text-lg flex items-center justify-center gap-2"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="h-5 w-5 animate-spin"/>
                                                                Envoi en cours...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Envoyer <Send className="h-5 w-5"/>
                                                            </>
                                                        )}
                                                    </Button>
                                                </motion.div>

                                                {/* Disclaimer */}
                                                <div
                                                    className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                                                    <AlertCircle
                                                        className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0"/>
                                                    <p>
                                                        Vos données personnelles sont traitées dans le cadre de notre
                                                        service de contact et ne seront pas partagées avec des tiers.
                                                        Les champs marqués d&#39;un astérisque (*) sont obligatoires.
                                                    </p>
                                                </div>
                                            </form>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;