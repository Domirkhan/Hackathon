import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { email, password, role, nickname, profession } = req.body;

    // Проверяем существование пользователя
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Пользователь уже существует' 
      });
    }

    // Проверяем обязательные поля для студента
    if (role === 'student' && !profession) {
      return res.status(400).json({
        success: false,
        message: 'Для студента обязательно указать профессию'
      });
    }

    // Создаем пользователя
    const user = await User.create({
      email,
      password,
      role,
      nickname,
      profession: role === 'student' ? profession : undefined
    });

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        nickname: user.nickname,
        profession: user.profession
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        nickname: user.nickname
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Отсутствует refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Невалидный refresh token' });
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(tokens);
  } catch (error) {
    res.status(401).json({ message: 'Невалидный refresh token' });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.refreshToken = null;
    await user.save();
    
    res.json({ message: 'Успешный выход' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};