import { FastifyRequest, FastifyReply } from "fastify";
import dotenv from 'dotenv';
import path from 'path';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import axios, { AxiosResponse } from "axios";
import jwt from 'jsonwebtoken';
import { getEnv } from "../utils/functions";

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev') });

const JWT_ACCESS = getEnv('JWT_ACCESS');
const JWT_REFRESH = getEnv('JWT_REFRESH');

export const tfaSetup = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };

  const secret = speakeasy.generateSecret({
    name: `ft_transcendance`
  });

  const cleanSecret = {
    ascii: secret.ascii,
    hex: secret.hex,
    base32: secret.base32,
    otpauth_url: secret.otpauth_url
  };

  try {
    await axios.post(
      `http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/qrcode/${id}`,
      cleanSecret
    );
  } catch (err: any) {
    const status = err.response?.status || 500;
    const message = err.response?.data || { message: "Internal server error" };
    return reply.code(status).send(message);
  }

  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

  return reply.code(201).send({
    message: "QR code generated",
    statusCode: 201,
    qrCodeUrl,
    secret: (secret.otpauth_url || "secret=Error").split("secret=")[1]
  });
};


export const tfaVerify = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const { token } = req.body as { token: string }

    const res = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/secret/${id}`)
    .catch((err) => {
        if(err.response)
            return reply.code(err.response.status).send({...err.response.data});
        else
            return reply.code(500).send({ message: 'Internal server ', statusCode: 500})
    })
    console.log(`token : ${res.data.secret}`)
    const verified = speakeasy.totp.verify({
        secret: res.data.secret,
        encoding: 'base32',
        token
    })

    if (!verified) {
        return reply.code(401).send({ message: "invalid code", statusCode: 401})
    }
    const response = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/${id}`)
    .catch((err) => {
        if(err.response)
            return reply.code(err.response.status).send({...err.response.data});
        else
            return reply.code(500).send({ message: 'Internal server ', statusCode: 500})
    })
    const accessToken = jwt.sign({ id: response.data.user.id, name: response.data.user.name }, JWT_ACCESS, { expiresIn: '15min' });
	const refreshToken = jwt.sign({ id: response.data.user.id, name: response.data.user.name }, JWT_REFRESH, { expiresIn: '7D' });
	return reply
		.setCookie('refreshToken', refreshToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60
		})
		.code(200)
		.send({
			message: "User logged in",
			statusCode: 200,
			user: response.data.user,
			accessToken,
	})
}

export const tfaActivate = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { token } = req.body as { token: string };

  const res = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/secret/${id}`)
    .catch((err) => {
        if(err.response)
            return reply.code(err.response.status).send({...err.response.data});
        else
            return reply.code(500).send({ message: 'Internal server ', statusCode: 500})
    })
    console.log(`token : ${res.data.secret}`)
    const verified = speakeasy.totp.verify({
        secret: res.data.secret,
        encoding: 'base32',
        token
    })

    if (!verified) {
        return reply.code(401).send({ message: "invalid code", statusCode: 401})
    }
    await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/tfa-activate/${id}`)
    .catch((err) => {
        if(err.response)
            return reply.code(err.response.status).send({...err.response.data});
        else
            return reply.code(500).send({ message: 'Internal server ', statusCode: 500})
    })
    return reply.code(200).send({
      message: "Correct code",
      statusCode: 200
    })
}

export const tfaDelete = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { token } = req.body as { token: string };

  const res = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/secret/${id}`)
    .catch((err) => {
        if(err.response)
            return reply.code(err.response.status).send({...err.response.data});
        else
            return reply.code(500).send({ message: 'Internal server ', statusCode: 500})
    })
    console.log(`token : ${res.data.secret}`)
    const verified = speakeasy.totp.verify({
        secret: res.data.secret,
        encoding: 'base32',
        token
    })

    if (!verified) {
        return reply.code(401).send({ message: "invalid code", statusCode: 401})
    }
    await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/tfa-delete/${id}`)
    .catch((err) => {
        if(err.response)
            return reply.code(err.response.status).send({...err.response.data});
        else
            return reply.code(500).send({ message: 'Internal server ', statusCode: 500})
    })
    return reply.code(200).send({
      message: "Correct code",
      statusCode: 200
    })
}